import { randomUUID } from "node:crypto";
import { drainInbox, inboxId, type Entry, type Intent, type InboxStore } from "./contact-inbox-core";

export function contactDay(timestamp: string | number) {
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) throw new Error("invalid-contact-date");
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Ljubljana", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (name: string) => parts.find(p => p.type === name)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export async function recordConfirmed(store: InboxStore, intent: Intent) {
  const id = inboxId(intent.key);
  const receipt = await store.read<{ receipt: string }>(`receipts/${id}.json`);
  if (!receipt?.receipt?.trim()) return false;
  const day = contactDay(intent.receivedAt);
  const path = `daily/${day}/${id}.json`;
  if (!await store.read(path)) await store.create(path, { id, day, confirmed: true });
  return true;
}
export async function dailyCount(store: InboxStore, day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) !== day) throw new Error("invalid-day");
  const prefix = `daily/${day}/`;
  const members = new Set<string>();
  for (const path of await store.paths(prefix)) {
    if (!path.startsWith(prefix)) continue;
    const record = await store.read<{ id: string; day: string; confirmed: boolean }>(path);
    if (record?.confirmed === true && record.day === day && /^[a-f0-9]{64}$/.test(record.id) && path === `${prefix}${record.id}.json`) members.add(record.id);
  }
  return members.size;
}
export async function queueHealth(store: InboxStore, now = Date.now()) {
  let pending = 0, oldestPendingMs = 0, counterLag = 0;
  for (const path of await store.paths()) {
    const entry = await store.read<Entry>(path);
    if (!entry || entry.kind !== "intent") continue;
    const id = inboxId(entry.key);
    const receipt = await store.read<{ receipt: string }>(`receipts/${id}.json`);
    if (receipt?.receipt?.trim()) {
      if (!await store.read(`daily/${contactDay(entry.receivedAt)}/${id}.json`)) counterLag++;
      continue;
    }
    const received = Date.parse(entry.receivedAt);
    if (!Number.isFinite(received) || received > now) throw new Error("invalid-queue-time");
    pending++;
    oldestPendingMs = Math.max(oldestPendingMs, now - received);
  }
  return { pending, oldestPendingMs, counterLag, queueStale: pending > 0 && oldestPendingMs >= 600000 };
}
type Run = { startedAt: number; finishedAt?: number; healthy?: boolean; failed?: boolean };
function utcDay(now: number) { return new Date(now).toISOString().slice(0, 10); }
export async function workerHealth(store: InboxStore, now = Date.now()) {
  let latestStarted = -1, latestFinished = -1, latestHealthy = -1;
  let latestFailed = false;
  for (const day of [utcDay(now), utcDay(now - 86400000)]) {
    for (const path of await store.paths(`runs/${day}/`)) {
      const run = await store.read<Run>(path);
      if (!run || !Number.isFinite(run.startedAt) || run.startedAt > now) continue;
      latestStarted = Math.max(latestStarted, run.startedAt);
      if (Number.isFinite(run.finishedAt) && run.finishedAt! <= now) {
        if (run.finishedAt! >= latestFinished) { latestFinished = run.finishedAt!; latestFailed = run.healthy !== true; }
        if (run.healthy === true) latestHealthy = Math.max(latestHealthy, run.finishedAt!);
      }
    }
  }
  const queue = await queueHealth(store, now);
  const stalled = latestStarted < 0 || latestFinished < latestStarted && now - latestStarted >= 600000;
  const heartbeatStale = latestHealthy < 0 || now - latestHealthy >= 600000;
  return { ...queue, stalled, heartbeatStale, latestFailed, healthy: !stalled && !heartbeatStale && !latestFailed && !queue.queueStale && queue.counterLag === 0, latestHealthy: latestHealthy < 0 ? null : new Date(latestHealthy).toISOString() };
}
export async function runContactWorker(store: InboxStore, configHash: string, deliver: (intent: Intent) => Promise<string>, clock = Date.now) {
  const startedAt = clock();
  const base = `runs/${utcDay(startedAt)}/${String(startedAt).padStart(13, "0")}-${randomUUID()}`;
  await store.create<Run>(`${base}-start.json`, { startedAt });
  try {
    const delivery = await drainInbox(store, configHash, deliver, startedAt);
    let confirmed = 0;
    for (const path of await store.paths()) {
      const intent = await store.read<Entry>(path);
      if (intent?.kind === "intent" && await recordConfirmed(store, intent)) confirmed++;
    }
    const queue = await queueHealth(store, clock());
    const healthy = delivery.pending === 0 && delivery.reconciliation === 0 && !queue.queueStale && queue.counterLag === 0;
    await store.create<Run>(`${base}-finish.json`, { startedAt, finishedAt: clock(), healthy });
    return { ...delivery, ...queue, confirmed, healthy };
  } catch (error) {
    await store.create<Run>(`${base}-finish.json`, { startedAt, finishedAt: clock(), healthy: false, failed: true });
    throw error;
  }
}

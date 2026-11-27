import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { acceptInbox, inboxId, type InboxStore } from "../lib/contact-inbox-core";
import { contactDay, dailyCount, recordConfirmed, queueHealth, workerHealth, runContactWorker } from "../lib/contact-operations";
import { authorizeContactWorker } from "../lib/contact-worker-auth";
import type { ContactPayload } from "../lib/validation/contact";
function fixture() {
  const entries = new Map<string, unknown>();
  const store: InboxStore = {
    async read<T>(path: string) { return (entries.get(path) as T) ?? null; },
    async create<T>(path: string, value: T) { if (!entries.has(path)) entries.set(path, structuredClone(value)); return entries.get(path) as T; },
    async paths(prefix = "intents/") { return [...entries.keys()].filter(p => p.startsWith(prefix)); },
  };
  return { store, entries };
}
const payload = { name: "Test Example", email: "test@example.com", message: "Synthetic only", company: "", phone: "", service: "Spletna stran", consent: true, consentAt: "2026-11-27T10:00:00.000Z", website: "" } as ContactPayload;
const now = Date.parse("2026-11-27T10:00:00Z");
const confirmed = async (store: InboxStore, key: string) => store.create(`receipts/${inboxId(key)}.json`, { receipt: `provider-${key}` });
test("daily ledger counts confirmed inquiries, not retries or queued requests", async () => {
  const { store } = fixture();
  const intents = await Promise.all(["a", "b", "c"].map(key => acceptInbox(store, key, payload, "cfg", now)));
  await confirmed(store, "a"); await confirmed(store, "b");
  await Promise.all(Array.from({ length: 8 }, () => recordConfirmed(store, intents[0])));
  await recordConfirmed(store, intents[1]); await recordConfirmed(store, intents[2]);
  assert.equal(await dailyCount(store, "2026-11-27"), 2);
  await confirmed(store, "c");
  for (const intent of intents) await recordConfirmed(store, intent);
  assert.equal(await dailyCount(store, "2026-11-27"), 3);
  for (const intent of intents) await recordConfirmed(store, intent);
  assert.equal(await dailyCount(store, "2026-11-27"), 3);
});
test("Ljubljana dates cross midnight and both DST transitions deterministically", () => {
  assert.equal(contactDay("2026-11-27T23:30:00Z"), "2026-11-28");
  for (const t of ["2026-03-29T00:30:00Z", "2026-03-29T01:30:00Z"]) assert.equal(contactDay(t), "2026-03-29");
  for (const t of ["2026-10-25T00:30:00Z", "2026-10-25T01:30:00Z"]) assert.equal(contactDay(t), "2026-10-25");
  assert.throws(() => contactDay("invalid"));
});
test("worker repairs missing counter after prior projection failure without re-sending", async () => {
  const { store } = fixture();
  await acceptInbox(store, "repair", payload, "cfg", now);
  await confirmed(store, "repair");
  assert.equal(await dailyCount(store, "2026-11-27"), 0);
  let sends = 0;
  await runContactWorker(store, "cfg", async () => { sends++; return "bad"; }, () => now + 1000);
  await runContactWorker(store, "cfg", async () => { sends++; return "bad"; }, () => now + 2000);
  assert.equal(sends, 0);
  assert.equal(await dailyCount(store, "2026-11-27"), 1);
});
test("queue age alarms at ten minutes and clears after recovery", async () => {
  const { store } = fixture();
  await acceptInbox(store, "pending", payload, "cfg", now);
  assert.equal((await queueHealth(store, now + 599999)).queueStale, false);
  assert.equal((await queueHealth(store, now + 600000)).queueStale, true);
  const fail = await runContactWorker(store, "cfg", async () => { throw new Error("offline"); }, () => now + 600000);
  assert.equal(fail.healthy, false);
  assert.equal((await workerHealth(store, now + 600001)).healthy, false);
  const ok = await runContactWorker(store, "cfg", async () => "receipt", () => now + 660000);
  assert.equal(ok.healthy, true);
  assert.equal((await queueHealth(store, now + 660001)).pending, 0);
});
test("missing or stopped heartbeats become unhealthy; monitor reads cannot reset timer", async () => {
  const { store } = fixture();
  assert.equal((await workerHealth(store, now)).healthy, false);
  await runContactWorker(store, "cfg", async () => "unused", () => now);
  assert.equal((await workerHealth(store, now + 599999)).healthy, true);
  assert.equal((await workerHealth(store, now + 600000)).heartbeatStale, true);
  assert.equal((await workerHealth(store, now + 700000)).heartbeatStale, true);
});
test("unfinished run and queue persist across reconstructed storage client", async () => {
  const { store, entries } = fixture();
  await runContactWorker(store, "cfg", async () => "unused", () => now);
  entries.set("runs/2026-11-27/crash-start.json", { startedAt: now + 1000 });
  const reopened = { ...store };
  assert.equal((await workerHealth(reopened, now + 601001)).stalled, true);
});
test("invalid secret including Unicode fails closed, no timing comparison exception", () => {
  const secret = "x".repeat(40);
  assert.equal(authorizeContactWorker(new Request("https://example.test"), secret), false);
  assert.equal(authorizeContactWorker(new Request("https://example.test", { headers: { authorization: `Bearer ${secret}` } }), secret), true);
  assert.equal(authorizeContactWorker(new Request("https://example.test", { headers: { authorization: `Bearer ${"é".repeat(40)}` } }), secret), false);
  assert.equal(authorizeContactWorker(new Request("https://example.test"), "short"), false);
});
test("test deployment config disables Git deployment and all licensed jobs", () => {
  const config = JSON.parse(readFileSync("vercel.json", "utf8"));
  assert.equal(config.git.deploymentEnabled, false);
  assert.deepEqual(config.crons, []);
  assert.equal(JSON.stringify(config).includes("license-backup"), false);
  assert.equal(config.schedules, undefined);
});
test("counter failures make worker unhealthy rather than silently reporting success", async () => {
  const { store } = fixture();
  await acceptInbox(store, "count-fail", payload, "cfg", now);
  await confirmed(store, "count-fail");
  const create = store.create.bind(store);
  store.create = async (path, value) => { if (path.startsWith("daily/")) throw new Error("write-offline"); return create(path, value); };
  await assert.rejects(runContactWorker(store, "cfg", async () => "bad", () => now + 1000));
  assert.equal((await workerHealth(store, now + 2000)).healthy, false);
});

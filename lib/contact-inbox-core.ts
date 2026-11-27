import { createHash } from "node:crypto";
import type { ContactPayload } from "./validation/contact";

export type Intent = { kind: "intent"; key: string; body: string; receivedAt: string; configHash: string };
export type Entry = Intent | { kind: "cancelled"; key: string };
export interface InboxStore {
  read<T>(path: string): Promise<T | null>;
  create<T>(path: string, value: T): Promise<T>;
  paths(prefix?: string): Promise<string[]>;
}
export const inboxId = (key: string) => createHash("sha256").update(key).digest("hex");
const entryPath = (key: string) => `intents/${inboxId(key)}.json`;
export async function acceptInbox(store: InboxStore, key: string, payload: ContactPayload, configHash: string, now = Date.now()) {
  const body = JSON.stringify(payload);
  const entry = await store.create<Entry>(entryPath(key), { kind: "intent", key, body, configHash, receivedAt: new Date(now).toISOString() });
  if (entry.kind === "cancelled" || entry.body !== body || entry.configHash !== configHash) throw new Error("inbox-conflict");
  return entry;
}
export async function inboxStatus(store: InboxStore, key: string) {
  const entry = await store.create<Entry>(entryPath(key), { kind: "cancelled", key });
  return entry.kind === "cancelled" ? "cancelled" as const : "accepted" as const;
}
export async function drainInbox(store: InboxStore, configHash: string, deliver: (intent: Intent) => Promise<string>, now = Date.now()) {
  const result = { delivered: 0, pending: 0, reconciliation: 0, cancelled: 0 };
  let processed = 0;
  for (const path of await store.paths()) {
    const entry = await store.read<Entry>(path);
    if (!entry || entry.kind === "cancelled") { result.cancelled++; continue; }
    const id = inboxId(entry.key);
    if (await store.read(`receipts/${id}.json`)) continue;
    const first = await store.create(`attempts/${id}.json`, { startedAt: now });
    if (entry.configHash !== configHash || now - first.startedAt >= 23 * 3600000) {
      result.reconciliation++; continue;
    }
    if (processed++ >= 50) { result.pending++; continue; }
    try {
      const receipt = await deliver(entry);
      if (!receipt.trim()) throw new Error("missing-receipt");
      await store.create(`receipts/${id}.json`, { receipt, confirmedAt: new Date(now).toISOString() });
      result.delivered++;
    } catch { result.pending++; }
  }
  return result;
}

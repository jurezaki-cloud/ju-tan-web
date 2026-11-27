import { test } from "node:test";
import assert from "node:assert/strict";
import { acceptInbox, inboxStatus, drainInbox, inboxId, type InboxStore } from "../lib/contact-inbox-core";
import type { ContactPayload } from "../lib/validation/contact";
function memory() {
  const entries = new Map<string, unknown>();
  const store: InboxStore = {
    async read<T>(p: string) { return (entries.get(p) as T) ?? null; },
    async create<T>(p: string, v: T) { if (!entries.has(p)) entries.set(p, structuredClone(v)); return entries.get(p) as T; },
    async paths() { return [...entries.keys()].filter(p => p.startsWith("intents/")); },
  };
  return { entries, store };
}
const payload = { name: "Test Example", email: "test@example.com", message: "Synthetic inquiry only", company: "Fixture", phone: "", service: "Spletna stran", consent: true, consentAt: "2026-11-27T10:00:00.000Z", website: "" } as ContactPayload;
test("durable acceptance and status need no database; repeat creates one intent", async () => {
  const { store, entries } = memory();
  await Promise.all(Array.from({ length: 8 }, () => acceptInbox(store, "key", payload, "config", 1000)));
  assert.equal(entries.size, 1);
  assert.equal(await inboxStatus(store, "key"), "accepted");
  await assert.rejects(acceptInbox(store, "key", { ...payload, message: "changed" }, "config"));
});
test("cancellation before acceptance prevents all subsequent acceptance", async () => {
  const { store } = memory();
  assert.equal(await inboxStatus(store, "cancel"), "cancelled");
  await assert.rejects(acceptInbox(store, "cancel", payload, "config"));
});
test("unavailable durable storage must not report success", async () => {
  const { store } = memory();
  store.create = async () => { throw new Error("storage-offline"); };
  await assert.rejects(acceptInbox(store, "no", payload, "config"));
  await assert.rejects(inboxStatus(store, "no"));
});
test("provider outage persists intent, retry records receipt, next drain does not resend", async () => {
  const { store } = memory();
  await acceptInbox(store, "retry", payload, "config");
  let calls = 0;
  const fail = await drainInbox(store, "config", async () => { calls++; throw new Error("provider-offline"); }, 1000);
  assert.equal(fail.pending, 1);
  const ok = await drainInbox(store, "config", async () => { calls++; return "receipt"; }, 2000);
  assert.equal(ok.delivered, 1);
  await drainInbox(store, "config", async () => { calls++; return "wrong"; }, 3000);
  assert.equal(calls, 2);
});
test("uncertain receipt write reuses deterministic provider idempotency key", async () => {
  const { store } = memory();
  await acceptInbox(store, "uncertain", payload, "config");
  const create = store.create.bind(store);
  let loseReceipt = true;
  store.create = async (p, v) => { if (p.startsWith("receipts/") && loseReceipt) { loseReceipt = false; throw new Error("receipt-write-outage"); } return create(p, v); };
  const ids: string[] = [];
  const deliver = async (intent: { key: string }) => { ids.push(`inbox-${inboxId(intent.key)}`); return "same-provider-receipt"; };
  assert.equal((await drainInbox(store, "config", deliver, 1000)).pending, 1);
  assert.equal((await drainInbox(store, "config", deliver, 2000)).delivered, 1);
  assert.equal(new Set(ids).size, 1);
});
test("expired or changed routing never sends automatically", async () => {
  const { store } = memory();
  await acceptInbox(store, "old", payload, "config");
  await drainInbox(store, "config", async () => { throw new Error("offline"); }, 1000);
  let sends = 0;
  const expired = await drainInbox(store, "config", async () => { sends++; return "bad"; }, 1000 + 23 * 3600000);
  assert.equal(expired.reconciliation, 1);
  assert.equal((await drainInbox(store, "different", async () => { sends++; return "bad"; }, 2000)).reconciliation, 1);
  assert.equal(sends, 0);
});
test("completed entries cannot starve later requests", async () => {
  const { store } = memory();
  for (let i = 0; i < 55; i++) await acceptInbox(store, `k${i}`, payload, "config");
  const deliver = async () => "confirmed";
  assert.equal((await drainInbox(store, "config", deliver, 1000)).delivered, 50);
  assert.equal((await drainInbox(store, "config", deliver, 2000)).delivered, 5);
});

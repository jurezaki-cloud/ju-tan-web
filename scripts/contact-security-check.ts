import assert from "node:assert/strict";
import { POST } from "../app/api/contact/route";
import { POST as drain } from "../app/api/contact/drain/route";
import { GET as health } from "../app/api/contact/health/route";

async function main() {
  let network = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async () => { network++; throw new Error("unexpected-network"); };
  process.env.CONTACT_WORKER_SECRET = "w".repeat(40);
  process.env.CONTACT_MONITOR_SECRET = "m".repeat(40);
  process.env.CONTACT_DURABLE_INBOX = "0";
  const payload = { name: "Synthetic", email: "test@example.invalid", service: "Website", message: "Test", consent: true, consentAt: "2026-11-27T10:00:00Z" };
  let sequence = 0;
  const req = (body: unknown, type = "application/json") => new Request("https://example.test/api/contact", { method: "POST", headers: { "Content-Type": type, "x-real-ip": `security-${sequence++}` }, body: JSON.stringify(body) });
  try {
    for (const handler of [drain, health]) {
      for (const authorization of ["", "Bearer short", `Bearer ${"z".repeat(40)}`]) {
        const response = await handler(new Request("https://example.test", { headers: { authorization } }));
        assert.equal(response.status, 401);
        assert.equal(await response.text(), "");
      }
    }
    assert.equal((await health(new Request("https://example.test", { headers: { authorization: `Bearer ${process.env.CONTACT_WORKER_SECRET}` } }))).status, 401);
    assert.equal((await drain(new Request("https://example.test", { headers: { authorization: `Bearer ${process.env.CONTACT_WORKER_SECRET}` } }))).status, 503);
    for (const change of [{ consent: false }, { email: "invalid" }, { name: "a" }, { message: "" }, { message: "x".repeat(5001) }, { consentAt: "bad" }]) assert.equal((await POST(req({ ...payload, ...change }))).status, 400);
    assert.equal((await POST(req(payload, "text/application/json"))).status, 415);
    assert.equal((await POST(req({ ...payload, message: "x".repeat(33000) }))).status, 413);
    assert.equal((await POST(req(payload))).status, 409);
    assert.equal(network, 0);
    console.log("PASS: real handlers reject unauthorized worker/monitor, cross-role secret, disabled inbox, invalid consent/email/fields, oversized body, wrong MIME and missing idempotency before network access");
  } finally { globalThis.fetch = original; }
}
main().catch(() => { console.error("FAIL: contact security assertions"); process.exitCode = 1; });

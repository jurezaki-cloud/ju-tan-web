import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { POST } from "../app/api/contact/route";
import { contactSchema } from "../lib/validation/contact";
import { contactPool } from "../lib/contact-db";
import { reserveContactAttempt, countContactAttempt } from "../lib/contact-ledger";

async function main() {
  const url = new URL(process.env.CONTACT_DATABASE_URL ?? "http://invalid");
  assert.equal(url.hostname, "localhost");
  assert.equal(url.pathname, "/ju_tan_contact_test");
  // License configuration is deliberately unusable: contact must not read it.
  process.env.LICENSING_DATABASE_URL = "not-a-license-database";
  delete process.env.JU_TAN_LICENSE_TOKEN_SECRET;
  delete process.env.JU_TAN_LICENSE_KEY_PEPPER;
  const db = contactPool();
  assert.equal((globalThis as { __juTanLicensingPool?: unknown }).__juTanLicensingPool, undefined);
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.EMAIL_FROM;
  const originalFallback = process.env.FROM_EMAIL;
  process.env.RESEND_API_KEY = "re_test_only";
  process.env.EMAIL_FROM = "JU-TAN Test <test@example.com>";
  const payload = {
    name: "Contact Test", email: " test@example.com ", service: "Spletne strani / UI-UX",
    message: "<script>test</script>", consent: true,
    consentAt: new Date().toISOString(), website: "",
  };
  let calls = 0;
  let deliveries = 0;
  let providerBody: Record<string, unknown> = {};
  let providerStatus = 200;
  let providerResult: object = { id: "test-message-id" };
  const replay = new Map<string, string>();
  const providerKeys: string[] = [];
  let failAfterAccept = false;
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /^https:\/\/api.resend.com\/emails$/);
    calls++;
    const body = String(init?.body);
    providerBody = JSON.parse(body);
    const key = new Headers(init?.headers).get("Idempotency-Key");
    assert.ok(key);
    providerKeys.push(key);
    const stored = replay.get(key);
    if (stored && stored !== body) return Response.json({ name: "invalid_idempotent_request", message: "Conflict" }, { status: 409 });
    if (!stored && providerStatus === 200) { replay.set(key, body); deliveries++; }
    if (failAfterAccept) { failAfterAccept = false; throw new Error("isolated lost response"); }
    return Response.json(providerResult, { status: providerStatus });
  };
  let sequence = 0;
  const key = () => `${Date.now()}.${randomUUID()}`;
  const request = (body: unknown, id: string | null = key()) => new Request("https://example.com/api/contact", {
    method: "POST", headers: {
      "Content-Type": "application/json", "x-real-ip": `contact-test-${sequence++}`,
      ...(id ? { "Idempotency-Key": id } : {}),
    }, body: JSON.stringify(body),
  });
  try {
    await db.query(readFileSync("scripts/sql/contact-idempotency.sql", "utf8"));
    assert.equal(contactSchema.parse(payload).email, "test@example.com");
    const success = await POST(request(payload));
    assert.equal(success.status, 200);
    assert.deepEqual(await success.json(), { success: true, conversionId: "test-message-id" });
    assert.equal(providerBody.reply_to, "test@example.com");
    assert.deepEqual(providerBody.to, ["info@ju-tan.com"]);
    assert.match(String(providerBody.html), /&lt;script&gt;/);
    const baseline = calls;
    assert.equal((await POST(request({ ...payload, consent: false }))).status, 400);
    assert.equal((await POST(request({ ...payload, email: "invalid" }))).status, 400);
    assert.deepEqual(await (await POST(request({ ...payload, website: "spam" }))).json(), { success: true });
    assert.equal((await POST(request(payload, null))).status, 409);
    assert.equal(calls, baseline);
    const retryKey = key();
    const deliveredBefore = deliveries;
    const first = await POST(request(payload, retryKey));
    const second = await POST(request(payload, retryKey));
    assert.deepEqual(await first.json(), await second.json());
    assert.equal(deliveries, deliveredBefore + 1);
    assert.equal(providerKeys.at(-1), `contact/${retryKey}`);
    assert.equal((await POST(request({ ...payload, message: "Changed" }, retryKey))).status, 500);
    const beforeInvalid = calls;
    assert.equal((await POST(request(payload, "invalid-key"))).status, 409);
    await db.query("UPDATE contact_delivery_attempts SET created_at = clock_timestamp() - INTERVAL '24 hours' WHERE retry_key=$1", [`contact/${retryKey}`]);
    assert.equal((await POST(request(payload, retryKey))).status, 409);
    assert.equal(calls, beforeInvalid);
    for (const clientTime of [Date.now() - 864000000, Date.now() + 864000000]) {
      assert.equal((await POST(request(payload, `${clientTime}.${randomUUID()}`))).status, 200);
    }
    const concurrentKey = key();
    const beforeConcurrent = deliveries;
    const concurrent = await Promise.all(Array.from({ length: 4 }, () => POST(request(payload, concurrentKey))));
    assert.ok(concurrent.every((res) => res.status === 200));
    const receipts = await Promise.all(concurrent.map((res) => res.json()));
    assert.ok(receipts.every((receipt) => receipt.conversionId === "test-message-id"));
    assert.equal(deliveries, beforeConcurrent + 1);
    const counted = await db.query("SELECT counted FROM contact_delivery_attempts WHERE retry_key=$1", [`contact/${concurrentKey}`]);
    assert.equal(counted.rows[0].counted, true);
    const ledgerKey = `contact/${key()}`;
    assert.deepEqual(await reserveContactAttempt(ledgerKey), await reserveContactAttempt(ledgerKey));
    const beforeCount = await db.query("SELECT COALESCE(SUM(confirmed),0)::text n FROM site_inquiry_daily WHERE service='Drugo'");
    await Promise.all(Array.from({ length: 8 }, () => countContactAttempt(ledgerKey, "not-a-service")));
    const afterCount = await db.query("SELECT COALESCE(SUM(confirmed),0)::text n FROM site_inquiry_daily WHERE service='Drugo'");
    assert.equal(Number(afterCount.rows[0].n) - Number(beforeCount.rows[0].n), 1);
    const uncertainKey = key();
    const beforeUncertain = deliveries;
    failAfterAccept = true;
    assert.equal((await POST(request(payload, uncertainKey))).status, 500);
    assert.equal((await POST(request(payload, uncertainKey))).status, 200);
    assert.equal(deliveries, beforeUncertain + 1);
    providerStatus = 422;
    providerResult = { name: "validation_error", message: "Test rejection" };
    assert.equal((await POST(request(payload))).status, 500);
    providerStatus = 200;
    providerResult = {};
    assert.equal((await POST(request(payload))).status, 500);
    delete process.env.RESEND_API_KEY; delete process.env.EMAIL_FROM; delete process.env.FROM_EMAIL;
    assert.equal((await POST(request(payload))).status, 503);
    process.env.RESEND_API_KEY = "re_test_only";
    process.env.EMAIL_FROM = "JU-TAN Test <test@example.com>";
    const beforeDbFailure = calls;
    await db.end();
    assert.equal((await POST(request(payload))).status, 503);
    assert.equal(calls, beforeDbFailure);
    assert.equal((globalThis as { __juTanLicensingPool?: unknown }).__juTanLicensingPool, undefined);
    console.log("PASS: independent contact pool, local PostgreSQL, concurrency, expiry, clock skew, response loss and mocked provider");
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({ RESEND_API_KEY: originalKey, EMAIL_FROM: originalFrom, FROM_EMAIL: originalFallback })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    await db.end().catch(() => {});
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

import assert from "node:assert/strict";
import { POST } from "../app/api/contact/route";
import { contactSchema } from "../lib/validation/contact";

async function main() {
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
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /^https:\/\/api.resend.com\/emails$/);
    calls++;
    const body = String(init?.body);
    providerBody = JSON.parse(body);
    const key = new Headers(init?.headers).get("Idempotency-Key");
    if (key) {
      providerKeys.push(key);
      const stored = replay.get(key);
      if (stored && stored !== body) return Response.json({ name: "invalid_idempotent_request", message: "Conflict" }, { status: 409 });
      if (!stored && providerStatus === 200) { replay.set(key, body); deliveries++; }
    } else if (providerStatus === 200) deliveries++;
    return Response.json(providerResult, { status: providerStatus });
  };
  let sequence = 0;
  const request = (body: unknown, key?: string) => new Request("https://example.com/api/contact", {
    method: "POST", headers: {
      "Content-Type": "application/json", "x-real-ip": `contact-test-${sequence++}`,
      ...(key ? { "Idempotency-Key": key } : {}),
    }, body: JSON.stringify(body),
  });
  try {
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
    const spam = await POST(request({ ...payload, website: "spam" }));
    assert.deepEqual(await spam.json(), { success: true });
    assert.equal(calls, baseline);

    const retryKey = `${Date.now()}.00000000-0000-4000-8000-000000000001`;
    const deliveredBefore = deliveries;
    const first = await POST(request(payload, retryKey));
    const second = await POST(request(payload, retryKey));
    assert.deepEqual(await first.json(), await second.json());
    assert.equal(deliveries, deliveredBefore + 1, "provider receives identical key/body across retries");
    assert.equal(providerKeys.at(-1), `contact/${retryKey}`);
    assert.equal((await POST(request({ ...payload, message: "Changed" }, retryKey))).status, 500);
    const beforeInvalid = calls;
    assert.equal((await POST(request(payload, "invalid-key"))).status, 409);
    assert.equal((await POST(request(payload, `${Date.now() - 86400000}.00000000-0000-4000-8000-000000000002`))).status, 409);
    assert.equal(calls, beforeInvalid, "expired keys never reach provider");

    providerStatus = 422;
    providerResult = { name: "validation_error", message: "Test rejection" };
    assert.equal((await POST(request(payload))).status, 500);
    providerStatus = 200;
    providerResult = {};
    assert.equal((await POST(request(payload))).status, 500);
    delete process.env.RESEND_API_KEY; delete process.env.EMAIL_FROM; delete process.env.FROM_EMAIL;
    assert.equal((await POST(request(payload))).status, 503);
    console.log("PASS: contact validation, accepted receipt, no false success, deterministic provider idempotency and expiry (all external calls mocked)");
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({ RESEND_API_KEY: originalKey, EMAIL_FROM: originalFrom, FROM_EMAIL: originalFallback })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

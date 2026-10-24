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
    name: "Contact Test",
    email: " test@example.com ",
    service: "Spletne strani / UI-UX",
    message: "<script>test</script>",
    consent: true,
    consentAt: new Date().toISOString(),
    website: "",
  };
  let calls = 0;
  let providerBody: Record<string, unknown> = {};
  let providerStatus = 200;
  let providerResult: object = { id: "test-message-id" };
  globalThis.fetch = async (_url, init) => {
    calls++;
    providerBody = JSON.parse(String(init?.body));
    return new Response(JSON.stringify(providerResult), {
      status: providerStatus,
      headers: { "Content-Type": "application/json" },
    });
  };
  let sequence = 0;
  const request = (body: unknown) =>
    new Request("https://example.com/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-real-ip": `contact-test-${sequence++}`,
      },
      body: JSON.stringify(body),
    });
  try {
    assert.equal(contactSchema.parse(payload).email, "test@example.com");
    const success = await POST(request(payload));
    assert.equal(success.status, 200);
    assert.deepEqual(await success.json(), { success: true });
    assert.equal(providerBody.reply_to, "test@example.com");
    assert.deepEqual(providerBody.to, ["info@ju-tan.com"]);
    assert.match(String(providerBody.html), /&lt;script&gt;/);
    const baseline = calls;
    assert.equal(
      (await POST(request({ ...payload, consent: false }))).status,
      400,
    );
    assert.equal(
      (await POST(request({ ...payload, email: "invalid" }))).status,
      400,
    );
    assert.equal(
      (await POST(request({ ...payload, website: "spam" }))).status,
      200,
    );
    assert.equal(
      calls,
      baseline,
      "Invalid input and honeypot must not send mail",
    );
    providerStatus = 422;
    providerResult = { name: "validation_error", message: "Test rejection" };
    assert.equal((await POST(request(payload))).status, 500);
    providerStatus = 200;
    providerResult = {};
    assert.equal(
      (await POST(request(payload))).status,
      500,
      "Missing provider ID must not confirm success",
    );
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    delete process.env.FROM_EMAIL;
    assert.equal((await POST(request(payload))).status, 503);
    console.log(
      "PASS: validation, trimming, provider acceptance/rejection, reply-to, escaping, honeypot and unavailable mail configuration",
    );
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({
      RESEND_API_KEY: originalKey,
      EMAIL_FROM: originalFrom,
      FROM_EMAIL: originalFallback,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

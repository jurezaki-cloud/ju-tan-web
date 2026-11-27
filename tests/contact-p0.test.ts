import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readContactSuccess, sendContactRequest, type ContactAttempt } from "../lib/contact-client";
import { contactRetryKey } from "../lib/contact-idempotency";
import type { ContactPayload } from "../lib/validation/contact";

const payload: ContactPayload = { name: "Synthetic", email: "nobody@example.invalid", service: "Splet", message: "Fixture", consent: true, consentAt: "2026-11-27T00:00:00Z" };

test("only explicit success is accepted; missing receipt never becomes a measured ID", async () => {
  for (const body of [null, {}, { success: false }, { success: "true" }]) {
    assert.equal(await readContactSuccess(Response.json(body)), null);
  }
  assert.equal(await readContactSuccess(new Response("{broken")), null);
  assert.equal(await readContactSuccess(Response.json({ success: true }, { status: 500 })), null);
  assert.deepEqual(await readContactSuccess(Response.json({ success: true })), { success: true });
  assert.deepEqual(await readContactSuccess(Response.json({ success: true, conversionId: "  " })), { success: true });
  assert.deepEqual(await readContactSuccess(Response.json({ success: true, conversionId: " receipt " })), { success: true, conversionId: "receipt" });
});

test("unchanged retries retain key and exact body; expiry fails closed", async () => {
  const previous = globalThis.fetch;
  const now = Date.now;
  let time = now();
  const calls: RequestInit[] = [];
  Date.now = () => time;
  globalThis.fetch = async (_url, init) => { calls.push(init!); return Response.json({ success: false }, { status: 500 }); };
  try {
    const attempt: ContactAttempt = {};
    await sendContactRequest(payload, attempt);
    time += 2000;
    await sendContactRequest(payload, attempt);
    assert.deepEqual(calls[0], calls[1]);
    const key = (calls[0].headers as Record<string, string>)["Idempotency-Key"];
    assert.ok(contactRetryKey(key, time));
    assert.ok(!key.includes(payload.email));
    await sendContactRequest({ ...payload, message: "New intent" }, attempt);
    assert.notEqual((calls[2].headers as Record<string, string>)["Idempotency-Key"], key);
    time += 24 * 60 * 60 * 1000;
    assert.throws(() => sendContactRequest({ ...payload, message: "New intent" }, attempt));
    assert.equal(calls.length, 3);
  } finally { globalThis.fetch = previous; Date.now = now; }
});

test("retry key rejects malformed, future and expired requests", () => {
  const now = Date.now();
  const uuid = "00000000-0000-4000-8000-000000000001";
  assert.equal(contactRetryKey(null, now), null);
  for (const raw of ["", "email@example.com", `${now + 120000}.${uuid}`, `${now - 86400000}.${uuid}`]) assert.equal(contactRetryKey(raw, now), false);
  assert.deepEqual(contactRetryKey(`${now}.${uuid}`, now), { key: `contact/${now}.${uuid}`, receivedAt: new Date(now).toISOString() });
});

test("inventory all contact callers and guard both form integrations", () => {
  const callers: string[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.[cm]?[jt]sx?$/.test(entry.name) && readFileSync(path, "utf8").includes('fetch("/api/contact"')) callers.push(path);
    }
  }
  for (const dir of ["app", "components", "lib", "src", "hooks"]) walk(dir);
  assert.deepEqual(callers, [join("lib", "contact-client.ts")]);
  for (const path of ["components/contact/ContactForm.tsx", "components/ai/LeadForm.tsx"]) {
    const code = readFileSync(path, "utf8");
    assert.match(code, /sendContactRequest\(parsed.data, attempt.current\)/);
    assert.match(code, /await readContactSuccess\(response\)/);
    assert.match(code, /trackContactConversion\(result\)/);
    assert.match(code, /submitting.current = true/);
  }
});

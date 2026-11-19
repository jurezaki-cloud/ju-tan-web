import assert from "node:assert/strict";
import { test } from "node:test";
import { clientKey, MemoryRateLimitStore } from "../lib/rate-limit";

test("contact limiter permits eight requests within its window and denies the ninth", () => {
  const store = new MemoryRateLimitStore();
  for (let index = 0; index < 8; index += 1) {
    assert.equal(store.isLimited("test-client-A"), false);
  }
  assert.equal(store.isLimited("test-client-A"), true);
});

test("contact limiter isolates independent client keys", () => {
  const store = new MemoryRateLimitStore();
  for (let index = 0; index < 8; index += 1) {
    assert.equal(store.isLimited("test-client-A"), false);
  }
  assert.equal(store.isLimited("test-client-A"), true);
  assert.equal(store.isLimited("test-client-B"), false);
});

test("current IP identification prefers x-real-ip on Vercel", () => {
  const request = new Request("https://ju-tan.com/api/contact", {
    headers: {
      "x-real-ip": "192.0.2.10",
      "x-forwarded-for": "198.51.100.2, 192.0.2.10",
    },
  });
  assert.equal(clientKey(request), "192.0.2.10");
});

test("fallback IP identification uses first forwarded address", () => {
  const request = new Request("https://ju-tan.com/api/contact", {
    headers: { "x-forwarded-for": "198.51.100.2, 203.0.113.3" },
  });
  assert.equal(clientKey(request), "198.51.100.2");
});

test("missing IP information uses the anonymous bucket", () => {
  const request = new Request("https://ju-tan.com/api/contact");
  assert.equal(clientKey(request), "anon");
});

test("separate in-memory instances do not share attempts", () => {
  const first = new MemoryRateLimitStore();
  const second = new MemoryRateLimitStore();
  for (let index = 0; index < 8; index += 1) {
    assert.equal(first.isLimited("shared-ip"), false);
  }
  assert.equal(first.isLimited("shared-ip"), true);
  assert.equal(second.isLimited("shared-ip"), false);
});

import assert from "node:assert/strict";
import { MemoryRateLimitStore } from "../lib/rate-limit";
const originalNow = Date.now;
let now = 1000;
Date.now = () => now;
try {
  const store = new MemoryRateLimitStore(2);
  for (let i = 0; i < 8; i++) assert.equal(store.isLimited("a"), false);
  assert.equal(store.isLimited("a"), true, "ninth attempt is blocked");
  assert.equal(store.isLimited("b"), false);
  assert.equal(
    store.isLimited("c"),
    true,
    "new identities cannot grow the store beyond capacity",
  );
  now += 10 * 60 * 1000;
  assert.equal(
    store.isLimited("c"),
    false,
    "expired identities release capacity",
  );
  assert.equal(store.isLimited("a"), false, "expired rate window allows retry");
  console.log(
    "PASS: contact rate window, bounded capacity, and expired-key cleanup",
  );
} finally {
  Date.now = originalNow;
}

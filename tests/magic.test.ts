import assert from "node:assert/strict";
import { test } from "node:test";
import {
  decodeMagic,
  encodeMagic,
  initialMagic,
  MAX_TOKEN_LENGTH,
} from "../lib/magic";

const sample = {
  ...initialMagic,
  to: "Tanja Žužek 💚",
  from: "Jure",
  message: "Čestitke!\nŠe veliko sreče 🎁",
};
test("all surprise kinds and themes survive a Unicode share-link round trip", () => {
  for (const kind of ["card", "secret", "gift", "invite"] as const) {
    for (const theme of ["mint", "rose", "gold"] as const) {
      const value = {
        ...sample,
        kind,
        theme,
        date: "2026-12-31T19:00",
        place: "Ljubljana",
      };
      const token = encodeMagic(value);
      assert.match(token, /^[A-Za-z0-9_-]+$/);
      assert.deepEqual(decodeMagic(token), value);
    }
  }
});
test("invalid, oversized and unknown-version payloads are rejected", () => {
  for (const token of [
    "",
    "%%%",
    "a".repeat(MAX_TOKEN_LENGTH + 1),
    btoa("{}"),
    Buffer.from(JSON.stringify({ ...sample, v: 2 })).toString("base64url"),
  ]) {
    assert.throws(() => decodeMagic(token));
  }
  assert.throws(() => encodeMagic({ ...sample, message: "x".repeat(601) }));
  assert.throws(() => encodeMagic({ ...sample, to: "   " }));
  assert.throws(() => encodeMagic({ ...sample, kind: "invite" }));
});
test("maximum supported Unicode content fits the URL limit", () => {
  const value = {
    ...sample,
    to: "💚".repeat(25),
    from: "Č".repeat(50),
    title: "🎁".repeat(40),
    message: "💚".repeat(300),
    place: "Ž".repeat(100),
  };
  assert.deepEqual(decodeMagic(encodeMagic(value)), value);
});
test("markup remains inert text in decoded content", () => {
  const value = { ...sample, message: '<script>alert("x")</script>' };
  assert.equal(decodeMagic(encodeMagic(value)).message, value.message);
});

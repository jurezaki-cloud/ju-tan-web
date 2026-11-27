import assert from "node:assert/strict";
import { test } from "node:test";
import { syncGoogleAds, trackContactConversion } from "../lib/google-ads";

test("two failed loads exhaust the budget; no conversion or late onload escapes", () => {
  const oldEnvironment = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const oldNow = Date.now;
  let clock = 10000;
  Date.now = () => clock;
  process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
  const scripts: HTMLScriptElement[] = [];
  let removed = 0;
  const fake = {
    location: { hostname: "ju-tan.com", pathname: "/kontakt" },
    dataLayer: [] as unknown[],
    localStorage: { getItem: () => "accepted" },
  };
  Object.defineProperty(globalThis, "window", { value: fake, configurable: true });
  Object.defineProperty(globalThis, "document", { value: {
    createElement: () => ({ remove() { removed++; } }),
    head: { appendChild: (script: HTMLScriptElement) => scripts.push(script) },
  }, configurable: true });
  const events = () => fake.dataLayer.map((item) => Array.from(item as ArrayLike<unknown>))
    .filter((item) => item[0] === "event");
  try {
    syncGoogleAds();
    assert.equal(trackContactConversion({ success: true, conversionId: "pending-one" }), true);
    assert.equal(scripts.length, 1);
    scripts[0].onerror?.call(scripts[0], new Event("error"));
    clock += 1001;
    syncGoogleAds();
    assert.equal(scripts.length, 2);
    scripts[1].onerror?.call(scripts[1], new Event("error"));
    for (let i = 0; i < 3; i++) {
      clock += 2000;
      syncGoogleAds();
    }
    assert.equal(scripts.length, 2, "never retry indefinitely");
    assert.equal(removed, 2);
    scripts[0].onload?.call(scripts[0], new Event("load"));
    scripts[1].onload?.call(scripts[1], new Event("load"));
    assert.deepEqual(events(), [], "failed or stale scripts cannot report success");
    assert.equal(trackContactConversion({ success: true, conversionId: "pending-one" }), false);
    assert.equal(scripts.length, 2);
  } finally {
    Date.now = oldNow;
    if (oldEnvironment === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = oldEnvironment;
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "document");
  }
});

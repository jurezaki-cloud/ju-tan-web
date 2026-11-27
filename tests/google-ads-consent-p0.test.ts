import assert from "node:assert/strict";
import { test } from "node:test";
import { writeAdsConsent } from "../lib/ads-consent";
import { syncGoogleAds, trackContactConversion } from "../lib/google-ads";

test("withdraw while loading clears queued receipt, later opt-in does not replay", () => {
  const previous = process.env.NEXT_PUBLIC_VERCEL_ENV;
  process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
  const storage = new Map<string, string>();
  const scripts: HTMLScriptElement[] = [];
  const fake = {
    location: { hostname: "ju-tan.com", pathname: "/kontakt" }, dataLayer: [] as unknown[],
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
  };
  Object.defineProperty(globalThis, "window", { value: fake, configurable: true });
  Object.defineProperty(globalThis, "document", { value: { createElement: () => ({ remove() {} }), head: { appendChild: (s: HTMLScriptElement) => scripts.push(s) } }, configurable: true });
  const events = () => fake.dataLayer.map((v) => Array.from(v as ArrayLike<unknown>)).filter((v) => v[0] === "event");
  try {
    writeAdsConsent("accepted"); syncGoogleAds();
    assert.equal(trackContactConversion({ success: true, conversionId: "cancel-me" }), true);
    writeAdsConsent("necessary"); syncGoogleAds();
    writeAdsConsent("accepted"); syncGoogleAds();
    scripts[0].onload?.call(scripts[0], new Event("load"));
    assert.equal(events().length, 0);
    assert.equal(trackContactConversion({ success: true, conversionId: "fresh" }), true);
    assert.equal(events().length, 1);
    fake.location.pathname = "/free/qr-studio";
    assert.equal(trackContactConversion({ success: true, conversionId: "private" }), false);
    assert.equal(events().length, 1);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV; else process.env.NEXT_PUBLIC_VERCEL_ENV = previous;
    Reflect.deleteProperty(globalThis, "window"); Reflect.deleteProperty(globalThis, "document");
  }
});

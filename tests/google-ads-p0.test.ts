import assert from "node:assert/strict";
import { test } from "node:test";
import { writeAdsConsent } from "../lib/ads-consent";
import { ADS_DESTINATION, adsEnvironmentAllowed, syncGoogleAds, trackContactConversion } from "../lib/google-ads";

test("production guard, controlled onerror retry, deduplication and revoke while loading", () => {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const now = Date.now;
  let clock = 2000;
  Date.now = () => clock;
  const values = new Map<string, string>();
  const scripts: HTMLScriptElement[] = [];
  const removed: HTMLScriptElement[] = [];
  const fakeWindow = {
    location: { hostname: "ju-tan.com", pathname: "/kontakt" },
    dataLayer: [] as unknown[],
    localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
  };
  Object.defineProperty(globalThis, "window", { value: fakeWindow, configurable: true });
  Object.defineProperty(globalThis, "document", { value: {
    createElement: () => { const script = { remove() { removed.push(script as unknown as HTMLScriptElement); } }; return script; },
    head: { appendChild: (script: HTMLScriptElement) => scripts.push(script) },
  }, configurable: true });
  const commands = () => fakeWindow.dataLayer.map((item) => Array.from(item as ArrayLike<unknown>));
  const events = () => commands().filter((item) => item[0] === "event");
  const receipt = { success: true, conversionId: " receipt " };
  try {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    writeAdsConsent("accepted");
    syncGoogleAds();
    assert.equal(scripts.length, 0);
    assert.equal(trackContactConversion(receipt), false);
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    assert.equal(adsEnvironmentAllowed("project.vercel.app"), false);
    assert.equal(adsEnvironmentAllowed("ju-tan.com.evil.invalid"), false);
    syncGoogleAds();
    syncGoogleAds();
    assert.equal(scripts.length, 1);
    assert.equal(trackContactConversion(receipt), true);
    scripts[0].onerror?.call(scripts[0], new Event("error"));
    assert.equal(removed.length, 1);
    syncGoogleAds();
    assert.equal(scripts.length, 1, "cooldown prevents load storms");
    clock += 1001;
    syncGoogleAds();
    assert.equal(scripts.length, 2);
    scripts[0].onload?.call(scripts[0], new Event("load"));
    assert.equal(events().length, 0, "stale script cannot flush");
    scripts[1].onload?.call(scripts[1], new Event("load"));
    assert.deepEqual(events(), [["event", "conversion", { send_to: ADS_DESTINATION, value: 1, currency: "EUR", transaction_id: "receipt" }]]);
    assert.equal(trackContactConversion({ success: true, conversionId: "receipt" }), false);
    writeAdsConsent("necessary");
    syncGoogleAds();
    assert.equal(trackContactConversion({ success: true, conversionId: "no-consent" }), false);
    writeAdsConsent("accepted");
    syncGoogleAds();
    assert.equal(events().length, 1, "opt-in never replays rejected submissions");
    const updates = commands().filter((item) => item[0] === "consent");
    assert.deepEqual(updates[0], ["consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" }]);
    assert.deepEqual(updates.at(-1), ["consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "denied" }]);
  } finally {
    if (env === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV; else process.env.NEXT_PUBLIC_VERCEL_ENV = env;
    Date.now = now;
    Reflect.deleteProperty(globalThis, "window"); Reflect.deleteProperty(globalThis, "document");
  }
});

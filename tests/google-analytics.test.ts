import assert from "node:assert/strict";
import { test } from "node:test";
import { ANALYTICS_CONSENT_KEY, getAnalyticsConsentSnapshot, writeAnalyticsConsent } from "../lib/consent";
import { writeAdsConsent } from "../lib/ads-consent";
import { ADS_ID, ADS_DESTINATION, GA4_ID, syncGoogleAds, trackContactConversion } from "../lib/google-ads";

test("GA4 renewed consent, shared loader, independent Ads, routing and revocation", () => {
  const originalEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const values = new Map([["ju-tan-analytics", "accepted"]]);
  const scripts: HTMLScriptElement[] = [];
  const fake = {
    location: { hostname: "ju-tan.com", pathname: "/kontakt", search: "?email=private@example.com", hash: "#secret" },
    dataLayer: [] as unknown[],
    "ga-disable-G-8Y5Z1S1GMG": false,
    localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
  };
  Object.defineProperty(globalThis, "window", { value: fake, configurable: true });
  Object.defineProperty(globalThis, "document", { value: {
    title: "private@example.com",
    createElement: () => ({ remove() {} }),
    head: { appendChild: (script: HTMLScriptElement) => scripts.push(script) },
  }, configurable: true });
  const commands = () => fake.dataLayer.map(value => Array.from(value as ArrayLike<unknown>));
  const pages = () => commands().filter(value => value[0] === "event" && value[1] === "page_view");
  const conversions = () => commands().filter(value => value[0] === "event" && value[1] === "conversion");
  const lastConsent = () => commands().filter(value => value[0] === "consent").at(-1)?.[2];
  try {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    assert.notEqual(ANALYTICS_CONSENT_KEY, "ju-tan-analytics");
    assert.equal(getAnalyticsConsentSnapshot(), null, "legacy Vercel-only opt-in is not GA consent");
    syncGoogleAds();
    assert.equal(scripts.length, 0);
    writeAnalyticsConsent("necessary"); syncGoogleAds();
    assert.equal(scripts.length, 0);
    writeAnalyticsConsent("accepted");
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview"; syncGoogleAds();
    assert.equal(scripts.length, 0);
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    fake.location.hostname = "preview.vercel.app"; syncGoogleAds();
    assert.equal(scripts.length, 0);
    fake.location.hostname = "ju-tan.com";
    fake.location.pathname = "/free/qr-studio"; syncGoogleAds();
    assert.equal(scripts.length, 0);
    fake.location.pathname = "/kontakt"; syncGoogleAds(); syncGoogleAds();
    assert.equal(scripts.length, 1);
    assert.ok(scripts[0].src.includes(GA4_ID));
    assert.equal(commands().some(value => value[0] === "config" && value[1] === ADS_ID), false);
    assert.equal(trackContactConversion({success:true, conversionId:"no-ads"}), false);
    assert.equal(pages().length, 0, "wait for loader before page events");
    writeAnalyticsConsent("necessary"); syncGoogleAds();
    scripts[0].onload?.call(scripts[0], new Event("load"));
    assert.equal(pages().length, 0, "withdraw during load sends no page view");
    assert.equal(fake["ga-disable-G-8Y5Z1S1GMG"], true);
    writeAnalyticsConsent("accepted"); syncGoogleAds(); syncGoogleAds();
    assert.deepEqual(pages(), [["event", "page_view", {send_to:GA4_ID, page_location:"https://ju-tan.com/kontakt", page_referrer:"", page_title:"/kontakt"}]]);
    writeAdsConsent("accepted"); syncGoogleAds();
    assert.equal(scripts.length, 1, "one shared Google script");
    assert.deepEqual(lastConsent(), {ad_storage:"granted", ad_user_data:"granted", ad_personalization:"denied", analytics_storage:"granted"});
    assert.equal(trackContactConversion({success:true, conversionId:"receipt"}), true);
    assert.equal(trackContactConversion({success:true, conversionId:"receipt"}), false);
    assert.equal((conversions()[0][2] as {send_to:string}).send_to, ADS_DESTINATION);
    writeAdsConsent("necessary"); syncGoogleAds();
    assert.deepEqual(lastConsent(), {ad_storage:"denied", ad_user_data:"denied", ad_personalization:"denied", analytics_storage:"granted"});
    fake.location.pathname = "/razvoj-programske-opreme"; syncGoogleAds(); syncGoogleAds();
    assert.equal(pages().length, 2, "one manual event per navigation");
    fake.location.pathname = "/free/qr-studio"; syncGoogleAds();
    assert.equal(fake["ga-disable-G-8Y5Z1S1GMG"], true);
    assert.equal(pages().length, 2);
    fake.location.pathname = "/kontakt"; syncGoogleAds();
    assert.equal(pages().length, 3);
    writeAdsConsent("accepted"); writeAnalyticsConsent("necessary"); syncGoogleAds();
    assert.deepEqual(lastConsent(), {ad_storage:"granted", ad_user_data:"granted", ad_personalization:"denied", analytics_storage:"denied"});
    assert.equal(trackContactConversion({success:true, conversionId:"ads-still-works"}), true);
    assert.equal(conversions().length, 2);
    assert.equal(pages().length, 3);
    assert.ok(!JSON.stringify(commands()).includes("private@example.com"));
    assert.ok(!JSON.stringify(commands()).includes("#secret"));
    const config = commands().find(value => value[0] === "config" && value[1] === GA4_ID)?.[2] as Record<string, unknown>;
    assert.equal(config.send_page_view, false);
    assert.equal(config.allow_google_signals, false);
  } finally {
    if (originalEnv === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV; else process.env.NEXT_PUBLIC_VERCEL_ENV = originalEnv;
    Reflect.deleteProperty(globalThis, "window"); Reflect.deleteProperty(globalThis, "document");
  }
});

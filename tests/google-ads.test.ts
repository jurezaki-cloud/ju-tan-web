import assert from "node:assert/strict";
import { test } from "node:test";
import { ADS_CONSENT_KEY, writeAdsConsent } from "../lib/ads-consent";
import {
  ADS_DESTINATION,
  syncGoogleAds,
  trackContactConversion,
} from "../lib/google-ads";

test("Ads requires separate consent, confirmed delivery and a unique receipt", () => {
  const values = new Map<string, string>([["ju-tan-analytics", "accepted"]]);
  const scripts: HTMLScriptElement[] = [];
  const fakeWindow = {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
    location: { pathname: "/kontakt" },
    dataLayer: [] as unknown[],
  };
  Object.defineProperty(globalThis, "window", {
    value: fakeWindow,
    configurable: true,
  });
  Object.defineProperty(globalThis, "document", {
    value: {
      createElement: () => ({}),
      head: {
        appendChild: (script: HTMLScriptElement) => scripts.push(script),
      },
    },
    configurable: true,
  });
  const commands = () =>
    fakeWindow.dataLayer.map((entry) =>
      Array.from(entry as ArrayLike<unknown>),
    );
  const events = () => commands().filter((entry) => entry[0] === "event");
  const receipt = { success: true, conversionId: "delivery-1" };
  try {
    syncGoogleAds();
    assert.equal(
      scripts.length,
      0,
      "legacy analytics acceptance is not Ads consent",
    );
    assert.equal(trackContactConversion(receipt), false);
    writeAdsConsent("necessary");
    syncGoogleAds();
    assert.equal(scripts.length, 0);
    writeAdsConsent("accepted");
    syncGoogleAds();
    syncGoogleAds();
    assert.equal(scripts.length, 1, "rerenders must not install multiple tags");
    assert.deepEqual(commands()[0].slice(0, 2), ["consent", "default"]);
    assert.equal(events().length, 0, "consent/page load is not a conversion");
    for (const result of [
      null,
      {},
      { success: true },
      { success: false, conversionId: "x" },
      { success: true, conversionId: "" },
    ]) {
      assert.equal(trackContactConversion(result), false);
    }
    assert.equal(trackContactConversion(receipt), true);
    assert.equal(trackContactConversion(receipt), false);
    assert.equal(
      events().length,
      0,
      "wait for the script without losing the receipt",
    );
    scripts[0].onload?.call(scripts[0], new Event("load"));
    assert.deepEqual(events(), [
      [
        "event",
        "conversion",
        {
          send_to: ADS_DESTINATION,
          value: 1,
          currency: "EUR",
          transaction_id: "delivery-1",
        },
      ],
    ]);
    assert.equal(trackContactConversion(receipt), false);
    values.set(ADS_CONSENT_KEY, "necessary");
    syncGoogleAds();
    assert.equal(
      trackContactConversion({ success: true, conversionId: "denied" }),
      false,
    );
    values.set(ADS_CONSENT_KEY, "accepted");
    fakeWindow.location.pathname = "/free/qr-studio";
    syncGoogleAds();
    assert.equal(
      trackContactConversion({ success: true, conversionId: "private" }),
      false,
    );
    fakeWindow.location.pathname = "/kontakt";
    syncGoogleAds();
    assert.equal(
      events().length,
      1,
      "never replay submissions made without consent",
    );
    assert.equal(
      trackContactConversion({ success: true, conversionId: "delivery-2" }),
      true,
    );
    assert.equal(events().length, 2);
  } finally {
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "document");
  }
});

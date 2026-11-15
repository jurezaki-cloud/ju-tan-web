import { getAdsConsent } from "./ads-consent";
import { isPrivateToolPath } from "./private-tool-path";

export const ADS_ID = "AW-18531808239";
// Verified from the user's Google Ads event-snippet screenshot, 2026-11-15.
export const ADS_DESTINATION = `${ADS_ID}/YQbkCOaJz7gdEO_n04RF`;
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}
let initialized = false;
let ready = false;
const seen = new Set<string>();
const pending = new Set<string>();
const denied = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

function allowed() {
  return (
    typeof window !== "undefined" &&
    getAdsConsent() === "accepted" &&
    !isPrivateToolPath(window.location.pathname)
  );
}

function emit(id: string) {
  window.gtag?.("event", "conversion", {
    send_to: ADS_DESTINATION,
    value: 1,
    currency: "EUR",
    transaction_id: id,
  });
}

/** Basic consent mode: no Google script or events before explicit Ads opt-in. */
export function syncGoogleAds() {
  if (typeof window === "undefined") return;
  if (!allowed()) {
    pending.clear();
    if (initialized) window.gtag?.("consent", "update", denied);
    return;
  }
  if (!initialized) {
    window.dataLayer ??= [];
    window.gtag ??= function () {
      // Google's command queue expects an Arguments object, not an event object.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", denied);
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("js", new Date());
    initialized = true;
    const script = document.createElement("script");
    script.id = "ju-tan-google-ads";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
    script.onload = () => {
      ready = true;
      if (allowed()) pending.forEach(emit);
      pending.clear();
    };
    script.onerror = () => {
      pending.clear();
    };
    window.gtag("consent", "update", {
      ...denied,
      ad_storage: "granted",
      ad_user_data: "granted",
    });
    window.gtag("config", ADS_ID, {
      send_page_view: false,
      allow_ad_personalization_signals: false,
    });
    document.head.appendChild(script);
    return;
  }
  window.gtag?.("consent", "update", {
    ...denied,
    ad_storage: "granted",
    ad_user_data: "granted",
  });
}

/** Only a real delivery receipt can produce a conversion; never replay on opt-in. */
export function trackContactConversion(result: unknown): boolean {
  try {
    if (
      !allowed() ||
      !result ||
      typeof result !== "object" ||
      !("success" in result) ||
      result.success !== true ||
      !("conversionId" in result) ||
      typeof result.conversionId !== "string" ||
      !result.conversionId.trim() ||
      seen.has(result.conversionId)
    )
      return false;
    syncGoogleAds();
    seen.add(result.conversionId);
    if (ready) emit(result.conversionId);
    else pending.add(result.conversionId);
    return true;
  } catch {
    // Tracking must never turn an accepted inquiry into a form error.
    return false;
  }
}

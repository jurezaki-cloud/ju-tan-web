import { getAdsConsent } from "./ads-consent";
import { isPrivateToolPath } from "./private-tool-path";

export const ADS_ID = "AW-18531808239";
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
let activeScript: HTMLScriptElement | undefined;
let attempts = 0;
let lastFailure = 0;
let generation = 0;
const seen = new Set<string>();
const pending = new Set<string>();
const denied = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

/** Fail closed on Preview, custom environments and unknown production hosts. */
export function adsEnvironmentAllowed(hostname: string): boolean {
  const local = hostname === "127.0.0.1" || hostname === "localhost";
  if (local) {
    return process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_GOOGLE_ADS_LOCAL_TEST === "1";
  }
  return process.env.NEXT_PUBLIC_VERCEL_ENV === "production" &&
    (hostname === "ju-tan.com" || hostname === "www.ju-tan.com");
}

function allowed() {
  return typeof window !== "undefined" &&
    adsEnvironmentAllowed(window.location.hostname) &&
    getAdsConsent() === "accepted" &&
    !isPrivateToolPath(window.location.pathname);
}

function emit(id: string) {
  if (!allowed() || seen.has(id) || !window.gtag) return;
  window.gtag("event", "conversion", {
    send_to: ADS_DESTINATION,
    value: 1,
    currency: "EUR",
    transaction_id: id,
  });
  // Queued to gtag, NOT a server acknowledgement. Google's transaction_id
  // deduplication is a separate safeguard, not a delivery guarantee.
  seen.add(id);
}

/** Basic Consent Mode: never load Google or queue conversions before Ads opt-in. */
export function syncGoogleAds() {
  if (typeof window === "undefined") return;
  if (!allowed()) {
    pending.clear();
    generation++;
    if (initialized) window.gtag?.("consent", "update", denied);
    return;
  }
  if (!initialized) {
    window.dataLayer ??= [];
    window.gtag ??= function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", denied);
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("js", new Date());
    initialized = true;
    window.gtag("config", ADS_ID, {
      send_page_view: false,
      allow_ad_personalization_signals: false,
    });
  }
  window.gtag?.("consent", "update", {
    ...denied,
    ad_storage: "granted",
    ad_user_data: "granted",
  });
  // One in-flight load; at most 2 attempts per document. Retrying is explicit
  // via sync/another accepted receipt, never a timer or replay on later opt-in.
  if (ready || activeScript || attempts >= 2 ||
      (lastFailure > 0 && Date.now() - lastFailure < 1000)) return;
  attempts++;
  const script = document.createElement("script");
  activeScript = script;
  const loadGeneration = generation;
  script.id = "ju-tan-google-ads";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  script.onload = () => {
    if (activeScript !== script) return;
    ready = true;
    activeScript = undefined;
    if (allowed() && loadGeneration === generation) {
      pending.forEach((id) => {
        try { emit(id); } catch { /* Never break a confirmed form. */ }
      });
    }
    pending.clear();
  };
  script.onerror = () => {
    if (activeScript !== script) return;
    activeScript = undefined;
    ready = false;
    lastFailure = Date.now();
    script.remove();
    // Keep only receipts collected under the current, uninterrupted consent.
    // They are not marked seen until queued; explicit retry may flush them.
    if (!allowed() || loadGeneration !== generation) pending.clear();
  };
  document.head.appendChild(script);
}

/** Call only on a confirmed API receipt; never on mount, clicks or form-submit. */
export function trackContactConversion(result: unknown): boolean {
  try {
    if (!allowed() || !result || typeof result !== "object" ||
      !("success" in result) || result.success !== true ||
      !("conversionId" in result) || typeof result.conversionId !== "string") return false;
    const id = result.conversionId.trim();
    if (!id || seen.has(id) || pending.has(id)) return false;
    syncGoogleAds();
    if (ready) emit(id);
    else pending.add(id);
    return true;
  } catch {
    return false;
  }
}

import { getAdsConsent } from "./ads-consent";
import { getAnalyticsConsentSnapshot } from "./consent";
import { isPrivateToolPath } from "./private-tool-path";

export const ADS_ID = "AW-18531808239";
export const GA4_ID = "G-8Y5Z1S1GMG";
export const ADS_DESTINATION = `${ADS_ID}/YQbkCOaJz7gdEO_n04RF`;
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    "ga-disable-G-8Y5Z1S1GMG"?: boolean;
  }
}

let initialized = false;
let adsConfigured = false;
let analyticsConfigured = false;
let lastAnalyticsPath: string | undefined;
let ready = false;
let activeScript: HTMLScriptElement | undefined;
let attempts = 0;
let lastFailure = 0;
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

function analyticsAllowed() {
  return typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" &&
    (window.location.hostname === "ju-tan.com" || window.location.hostname === "www.ju-tan.com") &&
    getAnalyticsConsentSnapshot() === "accepted" &&
    !isPrivateToolPath(window.location.pathname);
}

function emitPageView() {
  if (!ready || !analyticsAllowed() || !window.gtag) return;
  const path = window.location.pathname;
  if (lastAnalyticsPath === path) return;
  window.gtag("event", "page_view", {
    send_to: GA4_ID,
    page_location: `https://ju-tan.com${path}`,
    page_referrer: "",
    // Do not forward query strings, fragments, form data or dynamic titles.
    page_title: path,
  });
  lastAnalyticsPath = path;
}

/** Shared loader; Analytics and Ads retain independent opt-ins (Basic Consent Mode). */
export function syncGoogleAds() {
  if (typeof window === "undefined") return;
  const ads = allowed();
  const analytics = analyticsAllowed();
  window["ga-disable-G-8Y5Z1S1GMG"] = !analytics;
  if (!ads) pending.clear();
  if (!analytics) lastAnalyticsPath = undefined;
  const consent = {
    ...denied,
    ad_storage: ads ? "granted" : "denied",
    ad_user_data: ads ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
  };
  if (!ads && !analytics) {
    pending.clear();
    if (initialized) window.gtag?.("consent", "update", consent);
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
  }
  window.gtag?.("consent", "update", consent);
  if (ads && !adsConfigured) {
    window.gtag?.("config", ADS_ID, {
      send_page_view: false,
      allow_ad_personalization_signals: false,
    });
    adsConfigured = true;
  }
  if (analytics && !analyticsConfigured) {
    window.gtag?.("config", GA4_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: `https://ju-tan.com${window.location.pathname}`,
      page_referrer: "",
      page_title: window.location.pathname,
    });
    analyticsConfigured = true;
  }
  emitPageView();
  // One in-flight load; at most 2 attempts per document. Retrying is explicit
  // via sync/another accepted receipt, never a timer or replay on later opt-in.
  if (ready || activeScript || attempts >= 2 ||
      (lastFailure > 0 && Date.now() - lastFailure < 1000)) return;
  attempts++;
  const script = document.createElement("script");
  activeScript = script;
  script.id = "ju-tan-google-ads";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ads ? ADS_ID : GA4_ID}`;
  script.onload = () => {
    if (activeScript !== script) return;
    ready = true;
    activeScript = undefined;
    if (allowed()) {
      pending.forEach((id) => {
        try { emit(id); } catch { /* Never break a confirmed form. */ }
      });
    }
    pending.clear();
    emitPageView();
  };
  script.onerror = () => {
    if (activeScript !== script) return;
    activeScript = undefined;
    ready = false;
    lastFailure = Date.now();
    script.remove();
    // Revocation synchronously clears pending through syncGoogleAds. New
    // opt-ins never enqueue old receipts; no persistent conversion backlog.
    if (!allowed()) pending.clear();
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
    if (!id || seen.has(id)) return false;
    syncGoogleAds();
    if (pending.has(id)) return false;
    if (ready) emit(id);
    else pending.add(id);
    return true;
  } catch {
    return false;
  }
}

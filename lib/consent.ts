export const ANALYTICS_CONSENT_KEY = "ju-tan-analytics";

export type AnalyticsConsent = "accepted" | "necessary";

const listeners = new Set<() => void>();
let snapshot: AnalyticsConsent | null | undefined;

function parseConsent(value: string | null): AnalyticsConsent | null {
  if (value === "accepted" || value === "necessary") return value;
  return null;
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  return parseConsent(window.localStorage.getItem(ANALYTICS_CONSENT_KEY));
}

export function subscribeAnalyticsConsent(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function getAnalyticsConsentSnapshot(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  if (snapshot === undefined) {
    snapshot = readAnalyticsConsent();
  }
  return snapshot;
}

export function getAnalyticsConsentServerSnapshot(): AnalyticsConsent | null {
  return null;
}

export function writeAnalyticsConsent(value: AnalyticsConsent) {
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  snapshot = value;
  listeners.forEach((listener) => listener());
}

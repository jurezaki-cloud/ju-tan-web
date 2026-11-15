export const ADS_CONSENT_KEY = "ju-tan-ads-v1";
export type AdsConsent = "accepted" | "necessary";
const listeners = new Set<() => void>();
let fallback: AdsConsent | null = null;

export function getAdsConsent(): AdsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(ADS_CONSENT_KEY);
    return value === "accepted" || value === "necessary" ? value : null;
  } catch {
    return fallback;
  }
}

export function subscribeAdsConsent(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function writeAdsConsent(value: AdsConsent) {
  fallback = value;
  try {
    window.localStorage.setItem(ADS_CONSENT_KEY, value);
  } catch {
    /* Use the in-memory choice if storage is blocked. */
  }
  listeners.forEach((listener) => listener());
}

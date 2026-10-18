"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getAnalyticsConsentSnapshot,
  getAnalyticsConsentServerSnapshot,
  subscribeAnalyticsConsent,
} from "@/lib/consent";
import { usePathname } from "next/navigation";

const SESSION_KEY = "ju-tan-site-visit-counted";
const PAGE_KEY = "ju-tan-page-visit:";

export default function SiteVisitTracker() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getAnalyticsConsentServerSnapshot,
  );

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (
      pathname === "/magic" &&
      (consent !== "accepted" ||
        navigator.doNotTrack === "1" ||
        (navigator as Navigator & { globalPrivacyControl?: boolean })
          .globalPrivacyControl)
    )
      return;
    try {
      const pageKey = PAGE_KEY + pathname;
      if (sessionStorage.getItem(pageKey)) return;
      sessionStorage.setItem(pageKey, "1");
      if (!sessionStorage.getItem(SESSION_KEY))
        sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      return;
    }
    void fetch("/api/analytics/visit", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname, consent]);

  return null;
}

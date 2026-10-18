"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  subscribeAnalyticsConsent,
  getAnalyticsConsentSnapshot,
  getAnalyticsConsentServerSnapshot,
} from "@/lib/consent";

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
    // Honor the same analytics choice used by Vercel Analytics.
    // Do not access sessionStorage or send visits without opt-in.
    if (consent !== "accepted" || pathname.startsWith("/admin")) return;
    try {
      const pageKey = PAGE_KEY + pathname;
      if (sessionStorage.getItem(pageKey)) return;
      sessionStorage.setItem(pageKey, "1");
      if (!sessionStorage.getItem(SESSION_KEY)) sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      return;
    }
    void fetch("/api/analytics/visit", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    });
  }, [pathname, consent]);

  return null;
}

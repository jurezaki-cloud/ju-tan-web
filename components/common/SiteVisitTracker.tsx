"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "ju-tan-site-visit-counted";
const PAGE_KEY = "ju-tan-page-visit:";

export default function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
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
  }, [pathname]);

  return null;
}

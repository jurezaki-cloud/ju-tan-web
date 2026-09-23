"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "ju-tan-site-visit-counted";

export default function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      return;
    }
    void fetch("/api/analytics/visit", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
    });
  }, [pathname]);

  return null;
}

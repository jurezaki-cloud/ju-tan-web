"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieBanner from "@/components/legal/CookieBanner";
import {
  getAnalyticsConsentServerSnapshot,
  getAnalyticsConsentSnapshot,
  subscribeAnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/consent";
import { colors } from "@/design";

const subscribeNoop = () => () => {};
const getClientTrue = () => true;

function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === "light" ? "#f8fafc" : colors.background;
    document.querySelectorAll('meta[name="theme-color"]').forEach((node) => {
      node.setAttribute("content", color);
    });
  }, [resolvedTheme]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    () => false,
  );
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getAnalyticsConsentServerSnapshot,
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeColorMeta />
      {children}
      {consent === "accepted" ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
      {hydrated && consent === null ? (
        <CookieBanner onChoice={writeAnalyticsConsent} />
      ) : null}
    </ThemeProvider>
  );
}

"use client";

import { ThemeProvider, useTheme } from "next-themes";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
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
import { usePathname } from "next/navigation";
import { isPrivateToolPath } from "@/lib/private-tool-path";

import {
  getAdsConsent,
  subscribeAdsConsent,
  writeAdsConsent,
} from "@/lib/ads-consent";
import { syncGoogleAds } from "@/lib/google-ads";

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
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const adsConsent = useSyncExternalStore(
    subscribeAdsConsent,
    getAdsConsent,
    () => null,
  );
  useEffect(() => {
    syncGoogleAds();
    return subscribeAdsConsent(syncGoogleAds);
  }, [pathname]);
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
      {consent === "accepted" && !isPrivateToolPath(pathname) ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
      {hydrated && (consent === null || adsConsent === null || settingsOpen) ? (
        <CookieBanner
          onChoice={(analytics, ads) => {
            writeAnalyticsConsent(analytics);
            writeAdsConsent(ads);
            setSettingsOpen(false);
          }}
        />
      ) : null}
      {hydrated && consent !== null && adsConsent !== null && !settingsOpen ? (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-2 left-2 z-[70] rounded bg-slate-900 px-3 py-2 text-xs text-white"
        >
          Nastavitve piškotkov
        </button>
      ) : null}
    </ThemeProvider>
  );
}

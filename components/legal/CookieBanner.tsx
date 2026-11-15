"use client";

import { useState } from "react";
import { getAdsConsent, type AdsConsent } from "@/lib/ads-consent";
import { getAnalyticsConsentSnapshot } from "@/lib/consent";
import Link from "next/link";
import CTAButton from "@/components/navbar/CTAButton";
import { focusRing } from "@/design";
import { cn } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";
import type { AnalyticsConsent } from "@/lib/consent";

type CookieBannerProps = {
  onChoice: (value: AnalyticsConsent, ads: AdsConsent) => void;
};

export default function CookieBanner({ onChoice }: CookieBannerProps) {
  const [analytics, setAnalytics] = useState(
    getAnalyticsConsentSnapshot() === "accepted",
  );
  const [ads, setAds] = useState(getAdsConsent() === "accepted");
  const copy = getMessages().cookies;

  return (
    <aside
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-copy"
      className="fixed inset-x-0 bottom-0 z-banner border-t border-white/10 bg-[#050816]/95 px-[max(1.125rem,env(safe-area-inset-left,0px))] py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md light:border-slate-200 light:bg-white/95"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            id="cookie-banner-title"
            className="text-[13px] font-semibold tracking-[-0.01em] text-white light:text-slate-900"
          >
            {copy.title}
          </p>
          <p
            id="cookie-banner-copy"
            className="mt-1 max-w-[40rem] text-[14px] leading-[1.55] text-slate-400 light:text-slate-600"
          >
            {copy.message}{" "}
            <Link
              href="/politika-piskotkov"
              className={cn(
                "font-medium text-slate-200 underline-offset-4 hover:underline light:text-slate-800",
                focusRing,
              )}
            >
              {copy.policy}
            </Link>
            .
          </p>
          <label className="mt-3 block text-sm">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
            />{" "}
            Analitika obiska (Vercel)
          </label>
          <label className="mt-2 block text-sm">
            <input
              type="checkbox"
              checked={ads}
              onChange={(event) => setAds(event.target.checked)}
            />{" "}
            Merjenje uspešnih povpraševanj iz oglasov (Google Ads)
          </label>
          <p className="mt-2 text-xs">
            Google Ads uporablja piškotke in podatke o obisku za pripis uspešne
            oddaje oglasu. Vsebine obrazca ne pošiljamo Googlu. Izbiro lahko
            kadar koli spremenite v nastavitvah piškotkov.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <CTAButton
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => onChoice("necessary", "necessary")}
          >
            {copy.necessary}
          </CTAButton>
          <CTAButton
            type="button"
            size="compact"
            onClick={() =>
              onChoice(
                analytics ? "accepted" : "necessary",
                ads ? "accepted" : "necessary",
              )
            }
          >
            Shrani izbiro
          </CTAButton>
        </div>
      </div>
    </aside>
  );
}

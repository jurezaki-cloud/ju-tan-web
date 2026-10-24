"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import CTAButton from "@/components/navbar/CTAButton";
import { focusRing } from "@/design";
import { cn } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";
import type { AnalyticsConsent } from "@/lib/consent";

type CookieBannerProps = {
  onChoice: (value: AnalyticsConsent) => void;
};

export default function CookieBanner({ onChoice }: CookieBannerProps) {
  const copy = getMessages().cookies;
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = bannerRef.current;
    if (!node) return;
    const root = document.documentElement;

    const applyOffset = () => {
      root.style.setProperty("--cookie-banner-offset", `${node.offsetHeight}px`);
    };

    applyOffset();
    const observer = new ResizeObserver(applyOffset);
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--cookie-banner-offset");
    };
  }, []);

  return (
    <aside
      ref={bannerRef}
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-copy"
      className="fixed inset-x-0 bottom-0 z-banner border-t border-white/10 bg-[#050816]/97 px-[max(0.875rem,env(safe-area-inset-left,0px))] py-2.5 pr-[max(0.875rem,env(safe-area-inset-right,0px))] pb-[max(0.625rem,env(safe-area-inset-bottom,0px))] light:border-slate-200 light:bg-white/97"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          id="cookie-banner-copy"
          className="min-w-0 text-[12.5px] leading-[1.4] text-slate-300 light:text-slate-700"
        >
          <span
            id="cookie-banner-title"
            className="font-semibold text-white light:text-slate-900"
          >
            {copy.title}.{" "}
          </span>
          {copy.message}{" "}
          <Link
            href="/politika-piskotkov"
            prefetch={false}
            className={cn(
              "font-medium text-slate-100 underline-offset-4 hover:underline light:text-slate-900",
              focusRing,
            )}
          >
            {copy.policy}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <CTAButton
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => onChoice("necessary")}
          >
            {copy.necessary}
          </CTAButton>
          <CTAButton
            type="button"
            size="compact"
            onClick={() => onChoice("accepted")}
          >
            {copy.accept}
          </CTAButton>
        </div>
      </div>
    </aside>
  );
}

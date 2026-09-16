"use client";

import { useEffect } from "react";
import CTAButton from "@/components/navbar/CTAButton";
import { bodyClass, kickerClass } from "@/design";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true") {
      void import("@sentry/nextjs").then((Sentry) => {
        Sentry.captureException(error);
      });
    }
  }, [error]);

  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center px-[max(1.5rem,env(safe-area-inset-left,0px))] pt-[env(safe-area-inset-top,0px)] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-center"
    >
      <p className={cn(kickerClass, "justify-center text-green-600")}>
        500
      </p>
      <h1 className="heading-display mt-3.5 font-heading font-semibold text-white light:text-slate-900">
        Prišlo je do napake
      </h1>
      <p className={cn(bodyClass, "mt-3.5 max-w-md light:text-slate-600")}>
        Strani trenutno ni mogoče prikazati. Poskusite znova ali se vrnite na
        domačo stran.
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
        <CTAButton type="button" variant="secondary" onClick={reset}>
          Poskusi znova
        </CTAButton>
        <CTAButton href="/">Na domov</CTAButton>
      </div>
    </main>
  );
}

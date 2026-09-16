"use client";

import { useEffect } from "react";
import CTAButton from "@/components/navbar/CTAButton";
import { bodyClass, kickerClass } from "@/design";
import { cn } from "@/lib/utils";
import "./globals.css";

export default function GlobalError({
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
    <html lang="sl">
      <body className="min-h-screen bg-[#050816] font-sans text-white antialiased">
        <main
          id="main"
          className="flex min-h-dvh flex-col items-center justify-center px-[max(1.5rem,env(safe-area-inset-left,0px))] pt-[env(safe-area-inset-top,0px)] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-center"
        >
          <p className={cn(kickerClass, "justify-center text-[#16a34a]")}>
            500
          </p>
          <h1 className="heading-display mt-3.5 font-heading font-semibold text-white">
            Prišlo je do napake
          </h1>
          <p className={cn(bodyClass, "mt-3.5 max-w-md")}>
            Aplikacije trenutno ni mogoče naložiti. Poskusite znova.
          </p>
          <CTAButton type="button" className="mt-8" onClick={reset}>
            Poskusi znova
          </CTAButton>
        </main>
      </body>
    </html>
  );
}

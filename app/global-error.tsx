"use client";

import { useEffect } from "react";

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
          <p className="text-[14px] font-medium uppercase tracking-[0.16em] text-green-400">
            500
          </p>
          <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.03em] text-white">
            Prišlo je do napake
          </h1>
          <p className="mt-3 max-w-md text-slate-400">
            Aplikacije trenutno ni mogoče naložiti. Poskusite znova.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            Poskusi znova
          </button>
        </main>
      </body>
    </html>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";

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
      <p className="text-[14px] font-medium uppercase tracking-[0.16em] text-green-400">
        500
      </p>
      <h1 className="mt-3 font-heading text-[clamp(1.75rem,8vw,2.25rem)] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
        Prišlo je do napake
      </h1>
      <p className="mt-3 max-w-md text-slate-400 light:text-slate-600">
        Strani trenutno ni mogoče prikazati. Poskusite znova ali se vrnite na
        domačo stran.
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:border-slate-200 light:text-slate-800"
        >
          Poskusi znova
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          Na domov
        </Link>
      </div>
    </main>
  );
}

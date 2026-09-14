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
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-[14px] font-medium uppercase tracking-[0.16em] text-green-400">
        500
      </p>
      <h1 className="mt-3 font-heading text-[36px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
        Prišlo je do napake
      </h1>
      <p className="mt-3 max-w-md text-slate-400 light:text-slate-600">
        Strani trenutno ni mogoče prikazati. Poskusite znova ali se vrnite na
        domačo stran.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex rounded-xl border border-white/15 px-6 py-3 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:border-slate-200 light:text-slate-800"
        >
          Poskusi znova
        </button>
        <Link
          href="/"
          className="inline-flex rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          Na domov
        </Link>
      </div>
    </main>
  );
}

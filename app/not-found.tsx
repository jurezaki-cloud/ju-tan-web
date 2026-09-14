import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stran ne obstaja",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center px-[max(1.5rem,env(safe-area-inset-left,0px))] pt-[env(safe-area-inset-top,0px)] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-center"
    >
      <p className="text-[14px] font-medium uppercase tracking-[0.16em] text-green-400">
        404
      </p>
      <h1 className="mt-3 font-heading text-[clamp(1.75rem,8vw,2.25rem)] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
        Stran ne obstaja
      </h1>
      <p className="mt-3 max-w-md text-slate-400 light:text-slate-600">
        Naslov ni veljaven ali je bil premaknjen. Vrnite se na domačo stran.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        Na domov
      </Link>
    </main>
  );
}

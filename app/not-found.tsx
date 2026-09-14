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
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-[14px] font-medium uppercase tracking-[0.16em] text-green-400">
        404
      </p>
      <h1 className="mt-3 font-heading text-[36px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
        Stran ne obstaja
      </h1>
      <p className="mt-3 max-w-md text-slate-400 light:text-slate-600">
        Naslov ni veljaven ali je bil premaknjen. Vrnite se na domačo stran.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        Na domov
      </Link>
    </main>
  );
}

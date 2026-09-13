"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-12 flex flex-wrap gap-5">
      <Link
        href="#contact"
        className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 font-semibold text-white shadow-xl shadow-green-600/30 transition-all duration-300 hover:scale-105 hover:shadow-green-500/50"
      >
        Brezplačen posvet
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>

      <Link
        href="#services"
        className="rounded-2xl border border-white/15 px-8 py-4 font-semibold text-slate-200 transition-all duration-300 hover:border-green-400 hover:bg-white/5 hover:text-white"
      >
        Naše storitve
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-12 flex flex-wrap gap-5">
      <Link
        href="#contact"
        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-300 hover:scale-105 hover:shadow-green-500/50"
      >
        Brezplačen posvet
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>

      <Link
        href="#projects"
        className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:bg-white/10"
      >
        Oglej si projekte
        <FolderOpen
          className="transition-transform group-hover:scale-110"
          size={20}
        />
      </Link>
    </div>
  );
}

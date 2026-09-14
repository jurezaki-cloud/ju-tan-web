"use client";

import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";

const buttonTransition =
  "transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.97]";

export default function HeroButtons() {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <Link
        href="#contact"
        className={`group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-500/50 ${buttonTransition}`}
      >
        Brezplačen posvet
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

      <Link
        href="#projects"
        className={`group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white shadow-md shadow-black/20 backdrop-blur-sm hover:border-green-500/50 hover:bg-white/10 hover:shadow-lg hover:shadow-green-500/20 ${buttonTransition}`}
      >
        Oglej si projekte
        <FolderOpen
          className="transition-transform duration-300 group-hover:scale-110"
          size={20}
        />
      </Link>
    </div>
  );
}

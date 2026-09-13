"use client";

import Link from "next/link";

export default function CTAButton() {
  return (
    <Link
      href="#contact"
      className="
        rounded-full
        bg-emerald-500
        px-6
        py-3
        font-semibold
        text-white
        transition-all
        duration-300
        hover:bg-emerald-400
        hover:shadow-lg
        hover:shadow-emerald-500/30
      "
    >
      Brezplačen posvet
    </Link>
  );
}

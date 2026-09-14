"use client";

import Link from "next/link";
import { navigation } from "@/lib/navigation";

type NavLinksProps = {
  onNavigate?: () => void;
  className?: string;
};

export default function NavLinks({
  onNavigate,
  className = "hidden items-center gap-8 lg:flex",
}: NavLinksProps) {
  return (
    <nav className={className} aria-label="Glavna navigacija">
      {navigation.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onNavigate}
          className="relative rounded-sm text-[14px] font-medium tracking-[-0.01em] text-slate-300 transition hover:text-green-400 focus-visible:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-green-400 after:transition-all hover:after:w-full"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#050816]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-red-500 font-black text-white shadow-lg">
            JT
          </div>

          <div>
            <div className="text-xl font-bold">JU-TAN</div>
            <div className="text-xs text-gray-400">
              AI • Software • Automation
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          <a href="#" className="hover:text-green-400">Domov</a>
          <a href="#" className="hover:text-green-400">Storitve</a>
          <a href="#" className="hover:text-green-400">Projekti</a>
          <a href="#" className="hover:text-green-400">O nas</a>
          <a href="#" className="hover:text-green-400">Kontakt</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <button className="hidden rounded-xl bg-green-600 px-6 py-3 font-semibold transition hover:bg-green-500 lg:block">
            Brezplačen posvet
          </button>

          <button className="lg:hidden">
            <Menu />
          </button>
        </div>

      </div>
    </header>
  );
}
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { navigation } from "@/lib/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#050816]/95 shadow-2xl backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}

        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo/ju-tan-studio.png"
            alt="JU-TAN Studio"
            width={320}
            height={120}
            priority
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop */}

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative font-medium text-slate-300 transition hover:text-green-400"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* CTA */}

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="hidden rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition duration-300 hover:scale-105 hover:shadow-green-500/40 lg:block"
          >
            Brezplačen posvet
          </a>

          <button className="rounded-xl p-2 transition hover:bg-white/10 lg:hidden">
            <Menu size={28} />
          </button>
        </div>
      </div>
    </header>
  );
}

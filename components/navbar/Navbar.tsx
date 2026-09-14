"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import CTAButton from "./CTAButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/45 shadow-lg backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <Logo />
        <NavLinks />

        <div className="flex items-center gap-4">
          <CTAButton />

          <button
            type="button"
            aria-label="Odpri meni"
            className="rounded-xl p-2 transition hover:bg-white/10 lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

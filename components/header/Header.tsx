"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { lockBodyScroll } from "@/lib/lock-body-scroll";
import { getMessages } from "@/lib/i18n/messages";
import { getHeaderNavigation } from "@/lib/navigation";
import ThemeToggle from "@/components/navbar/ThemeToggle";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import CTAButton from "./CTAButton";
import { useActiveSection } from "./useActiveSection";
import { useScrolled } from "./useScrolled";

export default function Header() {
  const copy = getMessages().header;
  const items = useMemo(() => getHeaderNavigation(), []);
  const scrolled = useScrolled(12);
  const activeId = useActiveSection(items);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useEffect(() => {
    if (!menuOpen) return;
    return lockBodyScroll();
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[250ms] ${
        scrolled || menuOpen
          ? "border-b border-white/10 bg-[#050816]/80 shadow-lg backdrop-blur-xl light:border-slate-200 light:bg-white/90"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-3 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))]">
        <Logo />

        <DesktopNav
          items={items}
          activeId={activeId}
          ariaLabel={copy.navAria}
        />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle
            lightLabel={copy.themeLight}
            darkLabel={copy.themeDark}
          />

          <div className="hidden lg:block">
            <CTAButton />
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 lg:hidden light:text-slate-900 light:hover:bg-slate-100"
            onClick={toggleMenu}
          >
            <Menu size={28} aria-hidden />
          </button>
        </div>
      </div>

      <MobileNav
        open={menuOpen}
        onClose={closeMenu}
        items={items}
        activeId={activeId}
        labels={{ menuAria: copy.menuAria, closeMenu: copy.closeMenu }}
      />
    </header>
  );
}

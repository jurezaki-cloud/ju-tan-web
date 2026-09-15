"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { lockBodyScroll } from "@/lib/lock-body-scroll";
import { getMessages } from "@/lib/i18n/messages";
import { getHeaderNavigation } from "@/lib/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScroll } from "@/hooks/useScroll";
import ThemeToggle from "@/components/navbar/ThemeToggle";
import HeaderLogo from "./HeaderLogo";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import HeaderCTA from "./HeaderCTA";

const MenuIcon = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Menu })),
  {
    ssr: true,
    loading: () => <span className="size-7" aria-hidden />,
  },
);

function Header() {
  const copy = getMessages().header;
  const items = useMemo(() => getHeaderNavigation(), []);
  const scrolled = useScroll(12);
  const activeSection = useActiveSection(items);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useEffect(() => {
    if (!menuOpen) return;
    return lockBodyScroll();
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,backdrop-filter] duration-200 ease-out ${
        scrolled || menuOpen
          ? "border-b border-white/10 bg-[rgba(5,8,22,0.75)] backdrop-blur-xl light:border-slate-200 light:bg-white/90"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-3 px-4 md:px-6">
        <HeaderLogo />

        <DesktopNavigation
          items={items}
          activeSection={activeSection}
          ariaLabel={copy.navAria}
        />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle
            lightLabel={copy.themeLight}
            darkLabel={copy.themeDark}
          />

          <div className="hidden lg:block">
            <HeaderCTA />
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors duration-200 ease-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 lg:hidden light:text-slate-900 light:hover:bg-slate-100"
            onClick={toggleMenu}
          >
            <MenuIcon size={28} aria-hidden />
          </button>
        </div>
      </div>

      <MobileNavigation
        open={menuOpen}
        onClose={closeMenu}
        items={items}
        activeSection={activeSection}
      />
    </header>
  );
}

export default memo(Header);

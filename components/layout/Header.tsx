"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
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
      className={cn(
        "header-shell sticky top-0 w-full pt-[env(safe-area-inset-top,0px)]",
        (scrolled || menuOpen) && "header-shell-scrolled",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-[max(1.125rem,env(safe-area-inset-left,0px))] md:px-6">
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

          <div className="hidden xl:block">
            <HeaderCTA />
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] text-white transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 xl:hidden light:text-slate-900 light:hover:bg-slate-100"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" aria-hidden />
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

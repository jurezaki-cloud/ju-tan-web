"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { iconButtonClass } from "@/design";
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

const items = getHeaderNavigation();

export default function Header() {
  const copy = getMessages().header;
  const scrolled = useScroll(12);
  const activeSection = useActiveSection(items);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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
      <div className="container flex h-[60px] items-center justify-between gap-3">
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
            className={cn(
              iconButtonClass,
              "text-white hover:bg-white/10 xl:hidden light:text-slate-900 light:hover:bg-slate-100",
            )}
            onClick={() => setMenuOpen((open) => !open)}
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

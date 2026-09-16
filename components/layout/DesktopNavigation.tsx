"use client";

import { memo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { colorTransition, focusRing } from "@/design";
import type { NavItem, NavSectionId } from "@/types/navigation";

type DesktopNavigationProps = {
  items: NavItem[];
  activeSection: NavSectionId | null;
  ariaLabel: string;
};

function DesktopNavigation({
  items,
  activeSection,
  ariaLabel,
}: DesktopNavigationProps) {
  return (
    <nav
      className="hidden min-w-0 items-center justify-center gap-6 xl:flex xl:gap-8"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const active = activeSection === item.sectionId;

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative inline-flex min-h-11 items-center text-[14px] font-medium tracking-[0.02em] text-slate-400",
              colorTransition,
              "hover:text-white",
              "focus-visible:text-white",
              focusRing,
              "light:text-slate-600 light:hover:text-slate-900",
              active && "text-white light:text-slate-900",
            )}
          >
            <span className="relative inline-block">
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-1 h-px bg-[#16a34a] opacity-0 transition-opacity duration-hover ease-out",
                  "group-hover:opacity-100",
                  active && "opacity-100",
                )}
                aria-hidden
              />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default memo(DesktopNavigation);

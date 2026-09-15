import Link from "next/link";
import { memo } from "react";
import { cn } from "@/lib/utils";
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
    <nav className="hidden min-w-0 items-center justify-center gap-6 xl:flex xl:gap-8" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = activeSection === item.sectionId;

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-11 items-center text-[13px] font-medium tracking-[-0.01em] text-slate-400 transition-colors duration-200",
              "hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
              "light:text-slate-600 light:hover:text-slate-900",
              "after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-green-600/80 after:transition-[width] after:duration-200 hover:after:w-full",
              active && "text-white after:w-full light:text-slate-900",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default memo(DesktopNavigation);

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
    <nav className="hidden min-w-0 items-center justify-center gap-6 xl:gap-8 lg:flex" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = activeSection === item.sectionId;

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-11 items-center text-[14px] font-medium tracking-[-0.01em] text-slate-300 transition-colors duration-200 ease-out",
              "hover:text-green-400 focus-visible:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
              "light:text-slate-700 light:hover:text-green-600",
              "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-green-400 after:transition-all after:duration-200 after:ease-out hover:after:w-full",
              active && "text-green-400 after:w-full light:text-green-600",
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

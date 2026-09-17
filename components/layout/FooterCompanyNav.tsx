"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getHeaderNavigation } from "@/lib/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { hoverTransition } from "@/design";
import { cn } from "@/lib/utils";

const navItems = getHeaderNavigation();

const companyLinks = [
  { label: "Podjetje", href: "/#company" },
  { label: "Način dela", href: "/#process" },
  { label: "Kontakt", href: "/#booking" },
] as const;

function isCompanyLinkActive(
  href: string,
  pathname: string,
  section: ReturnType<typeof useActiveSection>,
) {
  if (pathname !== "/") return false;
  if (href === "/#company") return section === "company";
  if (href === "/#process") return section === "process";
  if (href === "/#booking") return section === "booking";
  return false;
}

export default function FooterCompanyNav() {
  const pathname = usePathname();
  const section = useActiveSection(navItems);

  return (
    <ul className="mt-4 divide-y divide-white/10 light:divide-slate-200">
      {companyLinks.map((item) => {
        const active = isCompanyLinkActive(item.href, pathname, section);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex min-h-10 items-center gap-3 rounded-lg py-2.5 text-[15px] leading-[1.5]",
                hoverTransition,
                "hover:text-white",
                "focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
                active
                  ? "text-white light:text-slate-900"
                  : "text-slate-300 light:text-slate-700",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full bg-[#16a34a]/80",
                  active && "bg-[#16a34a]",
                )}
                aria-hidden
              />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

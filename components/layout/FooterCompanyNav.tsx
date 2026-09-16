"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getHeaderNavigation } from "@/lib/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { hoverTransition } from "@/design";
import { cn } from "@/lib/utils";

const navItems = getHeaderNavigation();

const companyLinks = [
  { label: "Domov", href: "/" },
  { label: "Rešitve", href: "/#services" },
  { label: "Proces", href: "/#process" },
  { label: "Primeri sistemov", href: "/#projects" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Politika zasebnosti", href: "/politika-zasebnosti" },
  { label: "Politika piškotkov", href: "/politika-piskotkov" },
] as const;

function isCompanyLinkActive(
  href: string,
  pathname: string,
  section: ReturnType<typeof useActiveSection>,
) {
  if (href === "/politika-zasebnosti") return pathname === "/politika-zasebnosti";
  if (href === "/politika-piskotkov") return pathname === "/politika-piskotkov";
  if (href === "/kontakt") return pathname === "/kontakt";
  if (pathname !== "/") return false;
  if (href === "/") return section === "home";
  if (href === "/#services") return section === "services";
  if (href === "/#process") return section === "process";
  if (href === "/#projects") return section === "projects";
  return false;
}

export default function FooterCompanyNav() {
  const pathname = usePathname();
  const section = useActiveSection(navItems);

  return (
    <ul className="mt-6 space-y-1">
      {companyLinks.map((item) => {
        const active = isCompanyLinkActive(item.href, pathname, section);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-lg px-1 py-2.5 text-[15px] leading-[1.55]",
                hoverTransition,
                "hover:translate-x-px hover:text-white",
                "focus-visible:translate-x-px focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
                active
                  ? "text-white light:text-slate-900"
                  : "text-slate-300 light:text-slate-700",
              )}
            >
              <ChevronRight
                className="h-4 w-4 shrink-0 text-[#16a34a]"
                strokeWidth={2}
                aria-hidden
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

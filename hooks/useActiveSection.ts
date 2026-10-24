"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem, NavSectionId } from "@/types/navigation";

export function useActiveSection(items: NavItem[]) {
  const pathname = usePathname();
  const [sectionId, setSectionId] = useState<NavSectionId>("home");

  useEffect(() => {
    if (pathname !== "/") return;

    const uniqueIds = [...new Set(items.map((item) => item.sectionId))];
    const nodes = uniqueIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        const top = visible[0]?.target.id as NavSectionId | undefined;
        if (top) setSectionId(top);
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items, pathname]);

  const routeSection: Partial<Record<string, NavSectionId>> = {
    "/kontakt": "contact",
    "/ju-tan-office": "office",
    "/videoprodukcija": "video",
    "/graficno-oblikovanje": "graphics",
    "/reference": "references",
    "/spletne-strani-in-ui-ux": "services",
    "/razvoj-programske-opreme": "services",
  };

  const activeRoute = routeSection[pathname];
  if (activeRoute) return activeRoute;
  if (pathname !== "/") return null;
  return sectionId;
}

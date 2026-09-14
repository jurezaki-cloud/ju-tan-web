"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { HeaderNavItem } from "@/lib/navigation";

export function useActiveSection(items: HeaderNavItem[]) {
  const pathname = usePathname();
  const [sectionId, setSectionId] = useState<HeaderNavItem["id"]>("home");

  useEffect(() => {
    if (pathname !== "/") return;

    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );

        const top = visible[0]?.target.id as HeaderNavItem["id"] | undefined;
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

  if (pathname !== "/") return null;
  return sectionId;
}

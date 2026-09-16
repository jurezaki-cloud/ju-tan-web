"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { PrivacyChapter } from "@/lib/data/privacy";
import { cardSurface, colorTransition, focusRing, kickerClass } from "@/design";

type PrivacyTocProps = {
  chapters: PrivacyChapter[];
  variant: "sidebar" | "panel";
};

export default function PrivacyToc({ chapters, variant }: PrivacyTocProps) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const nodes = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id;
        if (id) setActive(id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="Kazalo politike zasebnosti"
      className={cn(
        variant === "sidebar" &&
          cn(cardSurface, "sticky top-24 hidden p-5 backdrop-blur-xl lg:block"),
        variant === "panel" &&
          cn(cardSurface, "p-5 backdrop-blur-xl lg:hidden"),
      )}
    >
      <p className={cn(kickerClass, "mb-3 text-slate-500")}>
        Kazalo
      </p>
      <ol className="space-y-1">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              className={cn(
                "flex min-h-11 items-baseline gap-2.5 rounded-lg px-2 py-1.5 text-[13px] leading-snug text-slate-400 hover:bg-white/[0.04] hover:text-white light:hover:text-slate-900",
                colorTransition,
                focusRing,
                active === chapter.id && "bg-white/[0.05] text-white light:text-slate-900",
              )}
            >
              <span className="tabular-nums text-[11px] text-green-600/80">
                {chapter.number}
              </span>
              <span>{chapter.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

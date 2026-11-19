"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The interactive diagram is below the initial mobile viewport. Do not ship
// Framer Motion and its event handlers until the visitor reaches the diagram.
// A lightweight static fallback keeps the visual composition and layout stable.
const InteractiveHeroStage = dynamic(() => import("./HeroStage"), {
  ssr: false,
});

export default function HeroStageDeferred() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: [0.25] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[440px] sm:min-h-[500px]">
      {visible ? (
        <InteractiveHeroStage />
      ) : (
        <div
          aria-label="Predstavitev digitalnega ekosistema JU-TAN"
          className="flex min-h-[440px] flex-col rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,28,0.96),rgba(6,10,20,0.92))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.36)] light:border-slate-200 light:bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] sm:min-h-[500px]"
        >
          <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-300 light:border-slate-200 light:text-slate-700">
            <span>JU-TAN · Digitalni ekosistem</span>
            <span className="text-emerald-400 light:text-emerald-700">Aktivno</span>
          </div>
          <div className="mt-3 flex flex-1 flex-col items-center justify-center gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.015] px-4 py-8 text-center light:border-slate-200 light:bg-white/80">
            <p className="text-sm font-semibold text-white light:text-slate-900">
              Povezane digitalne rešitve
            </p>
            <div className="flex size-28 items-center justify-center rounded-[1.5rem] border border-emerald-500/30 bg-emerald-500/10 text-2xl font-semibold text-white shadow-[0_0_70px_rgba(22,163,74,0.12)] light:text-slate-900">
              JU-TAN
            </div>
            <p className="max-w-60 text-xs leading-6 tracking-wide text-slate-400 light:text-slate-600">
              Design · Aplikacije · Podatki · Poslovni sistemi · Integracije · AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

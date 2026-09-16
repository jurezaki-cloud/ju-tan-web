"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Radar = dynamic(() => import("./radar/Radar"), { ssr: false });

function RadarPlaceholder() {
  return (
    <div
      className="hero-radar relative mx-auto aspect-square h-auto w-full max-h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.18),transparent_62%)]"
      aria-hidden
    />
  );
}

export default function HeroStage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(() => setReady(true));
      return () => win.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return <RadarPlaceholder />;
  return <Radar />;
}

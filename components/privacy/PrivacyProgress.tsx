"use client";

import { useEffect, useState } from "react";

export default function PrivacyProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const article = document.getElementById("privacy-article");
        frame = 0;
        if (!article) return;
        const rect = article.getBoundingClientRect();
        const total = article.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        setProgress(total > 0 ? scrolled / total : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-overlay h-[2px] bg-white/5 light:bg-slate-200"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-[#16a34a]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

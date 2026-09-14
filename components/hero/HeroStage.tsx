"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import AICoreFallback, { AnalyticsCards } from "./AICoreFallback";

const AICoreCanvas = dynamic(() => import("./AICoreCanvas"), {
  ssr: false,
});

function subscribeMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

export default function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    if (reduceMotion || window.matchMedia("(max-width: 767px)").matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      tilt.style.transform = `rotateX(${currentY.toFixed(3)}deg) rotateY(${currentX.toFixed(3)}deg)`;
      const settled =
        Math.abs(targetX - currentX) < 0.02 && Math.abs(targetY - currentY) < 0.02;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = Math.max(-0.5, Math.min(0.5, nx)) * 7;
      targetY = Math.max(-0.5, Math.min(0.5, ny)) * -5;
      kick();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      kick();
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      tilt.style.transform = "";
    };
  }, [reduceMotion]);

  return (
    <div
      ref={stageRef}
      className="group relative mx-auto aspect-square w-full max-w-[min(420px,100%)] overflow-hidden [perspective:900px] sm:overflow-visible"
      aria-hidden
    >
      <div ref={tiltRef} className="relative h-full w-full [transform-style:preserve-3d]">
        <div
          className={`hero-core-bloom pointer-events-none absolute inset-[8%] rounded-full bg-green-500/25 blur-[70px] sm:blur-[90px] ${
            reduceMotion ? "" : "hero-core-breathe"
          }`}
        />
        <div className="group-has-[[data-ai-core]]:invisible">
          <AICoreFallback />
        </div>
        {reduceMotion ? null : <AICoreCanvas />}
        <AnalyticsCards floating={!reduceMotion} />
      </div>
    </div>
  );
}

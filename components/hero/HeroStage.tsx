"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import HeroNetwork from "./HeroNetwork";

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
        Math.abs(targetX - currentX) < 0.02 &&
        Math.abs(targetY - currentY) < 0.02;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = Math.max(-0.5, Math.min(0.5, nx)) * 6;
      targetY = Math.max(-0.5, Math.min(0.5, ny)) * -4;
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
      className="relative mx-auto aspect-square w-full max-w-[min(380px,100%)] overflow-hidden [perspective:900px] sm:max-w-[min(460px,100%)] sm:overflow-visible lg:max-w-[520px]"
      aria-hidden
    >
      <div
        className={`pointer-events-none absolute inset-[12%] rounded-full bg-green-500/20 blur-[80px] ${
          reduceMotion ? "" : "hero-core-breathe"
        }`}
      />
      <div ref={tiltRef} className="relative h-full w-full [transform-style:preserve-3d]">
        <HeroNetwork motion={!reduceMotion} />
      </div>
    </div>
  );
}

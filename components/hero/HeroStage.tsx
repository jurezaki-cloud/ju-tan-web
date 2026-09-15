"use client";

import { useEffect, useRef } from "react";
import HeroNetwork from "./HeroNetwork";

export default function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
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
      targetX = Math.max(-0.5, Math.min(0.5, nx)) * 2.8;
      targetY = Math.max(-0.5, Math.min(0.5, ny)) * -2;
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
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto aspect-square h-auto w-full max-h-full [perspective:1400px]"
      aria-hidden
    >
      <div className="hero-core-breathe pointer-events-none absolute inset-[18%] rounded-full bg-green-700/12 blur-[80px]" />
      <div ref={tiltRef} className="relative h-full w-full [transform-style:preserve-3d]">
        <HeroNetwork motion />
      </div>
    </div>
  );
}

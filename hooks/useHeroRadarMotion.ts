"use client";

/**
 * Desktop pointer parallax for the hero stage.
 * Values are written as CSS variables so the stage does not depend on
 * Framer Motion. Pointer tracking stays off for coarse pointers and
 * viewports below 768px.
 */

import { useEffect, useState, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const RADAR_BOOT_MS = 500;
export const RADAR_FIRST_PULSE_MS = 3000;
export const RADAR_SWEEP_S = 8;
export const RADAR_CORE_PULSE_S = 2.8;
export const RADAR_GLOW_BREATHE_S = 12;
export const RADAR_PULSE_MIN_MS = 6000;
export const RADAR_PULSE_SPAN_MS = 4000;
export const RADAR_PARTICLE_S = 1.2;

export type HeroRadarMotion = {
  reduce: boolean;
  live: boolean;
  hovered: boolean;
};

function writePointer(stage: HTMLElement, x: number, y: number) {
  stage.style.setProperty("--hero-nx", x.toFixed(3));
  stage.style.setProperty("--hero-ny", y.toFixed(3));
}

export function useHeroRadarMotion(
  stageRef: RefObject<HTMLElement | null>,
): HeroRadarMotion {
  const reduce = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const live = !reduce && armed && visible && pageVisible;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(stage);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [stageRef]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => setArmed(true), RADAR_BOOT_MS);
    return () => window.clearTimeout(id);
  }, [reduce]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reset = () => writePointer(stage, 0, 0);

    if (reduce) {
      reset();
      return;
    }

    const fine = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 768px)");

    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const tick = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      writePointer(stage, currentX, currentY);
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || !wide.matches) {
        targetX = 0;
        targetY = 0;
        schedule();
        return;
      }
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = Math.max(-1, Math.min(1, nx * 2));
      targetY = Math.max(-1, Math.min(1, ny * 2));
      schedule();
    };

    const onEnter = () => setHovered(true);
    const onLeave = () => {
      setHovered(false);
      targetX = 0;
      targetY = 0;
      schedule();
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      reset();
    };
  }, [reduce, stageRef]);

  return { reduce, live, hovered };
}

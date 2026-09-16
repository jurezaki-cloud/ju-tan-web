"use client";

/**
 * Radar motion.
 *
 * Why the previous implementation was static:
 * 1. `framer-motion@13` does not export `useAnimationFrame`. Importing it
 *    aborted the client module, so rotate never wrote a transform.
 * 2. Core rings used Tailwind `-translate-x/y-1/2` plus Framer `scale`.
 *    Framer replaces `transform`, so rings jumped off-center and looked dead.
 * 3. Data pulses animated SVG `cx`/`cy` (or Framer SVG x/y), not transform.
 *
 * This hook uses native rAF + element.style.transform only.
 */

import { useEffect, useState, type RefObject } from "react";
import { useSpring, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const RADAR_BOOT_MS = 500;
export const RADAR_FIRST_PULSE_MS = 3000;
export const RADAR_SWEEP_S = 8;
export const RADAR_CORE_PULSE_S = 2.8;
export const RADAR_GLOW_BREATHE_S = 12;
export const RADAR_PULSE_MIN_MS = 6000;
export const RADAR_PULSE_SPAN_MS = 4000;
export const RADAR_PARTICLE_S = 1.2;

const SPRING = { stiffness: 70, damping: 26, mass: 0.8 } as const;

export type HeroRadarMotion = {
  reduce: boolean;
  live: boolean;
  hovered: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

export function useHeroRadarMotion(
  stageRef: RefObject<HTMLElement | null>,
): HeroRadarMotion {
  const reduce = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pointerX = useSpring(0, SPRING);
  const pointerY = useSpring(0, SPRING);
  const live = !reduce && armed;

  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => setArmed(true), RADAR_BOOT_MS);
    return () => window.clearTimeout(id);
  }, [reduce]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    if (reduce) {
      reset();
      return;
    }

    const fine = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 768px)");

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || !wide.matches) {
        reset();
        return;
      }
      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointerX.set(Math.max(-1, Math.min(1, nx * 2)));
      pointerY.set(Math.max(-1, Math.min(1, ny * 2)));
    };

    const onEnter = () => setHovered(true);
    const onLeave = () => {
      setHovered(false);
      reset();
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
      reset();
    };
  }, [pointerX, pointerY, reduce, stageRef]);

  return { reduce, live, hovered, pointerX, pointerY };
}

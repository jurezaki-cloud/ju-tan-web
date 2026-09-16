"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { RADAR_GLOW_BREATHE_S } from "@/hooks/useHeroRadarMotion";

type RadarGlowProps = {
  live: boolean;
  hovered: boolean;
  reduce: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

export default function RadarGlow({
  live,
  hovered,
  reduce,
  pointerX,
  pointerY,
}: RadarGlowProps) {
  const x = useTransform(pointerX, (value) => value * 14);
  const y = useTransform(pointerY, (value) => value * 14);

  return (
    <motion.div
      className="pointer-events-none absolute inset-[18%] will-change-transform"
      style={{ x, y, opacity: hovered && live ? 1 : 0.92 }}
    >
      <div
        className="h-full w-full rounded-full bg-green-700/12 blur-[80px] will-change-transform"
        style={
          reduce || !live
            ? undefined
            : {
                animation: `hero-radar-glow ${RADAR_GLOW_BREATHE_S}s ease-in-out infinite`,
              }
        }
      />
    </motion.div>
  );
}

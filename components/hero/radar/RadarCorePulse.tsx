"use client";

import { motion } from "framer-motion";
import { RADAR_CORE_PULSE_S } from "@/hooks/useHeroRadarMotion";

const ringClass =
  "pointer-events-none absolute top-1/2 left-1/2 h-[9%] w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#16a34a] blur-[3px]";

export default function RadarCorePulse({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <>
      <motion.span
        className={ringClass}
        initial={{ scale: 1, opacity: 0.25 }}
        animate={{ scale: [1, 2.35], opacity: [0.25, 0] }}
        transition={{
          duration: RADAR_CORE_PULSE_S,
          repeat: Infinity,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      <motion.span
        className={ringClass}
        initial={{ scale: 1, opacity: 0.18 }}
        animate={{ scale: [1, 2.05], opacity: [0.18, 0] }}
        transition={{
          duration: RADAR_CORE_PULSE_S,
          repeat: Infinity,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.45,
        }}
      />
      <motion.span
        className="pointer-events-none absolute top-1/2 left-1/2 h-[2.9%] w-[2.9%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#16a34a]"
        initial={{ scale: 1, opacity: 0.88 }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.88, 1, 0.88] }}
        transition={{
          duration: RADAR_CORE_PULSE_S,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}

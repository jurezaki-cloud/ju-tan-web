"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CENTER_ATTR } from "./geometry";
import { RADAR_CORE_PULSE_S } from "@/hooks/useHeroRadarMotion";

type RadarCoreProps = {
  live: boolean;
  hovered: boolean;
  reduce: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

export default function RadarCore({
  live,
  hovered,
  reduce,
  pointerX,
  pointerY,
}: RadarCoreProps) {
  const x = useTransform(pointerX, (value) => value * 4);
  const y = useTransform(pointerY, (value) => value * 4);
  const animate = live && !reduce;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 will-change-transform"
      style={{ x, y }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
        <circle
          cx={CENTER_ATTR}
          cy={CENTER_ATTR}
          r="6.4"
          className="hero-core-void"
          stroke="currentColor"
          strokeWidth="0.32"
          opacity="0.9"
        />
        <circle
          cx={CENTER_ATTR}
          cy={CENTER_ATTR}
          r="1.45"
          fill="#16a34a"
          opacity={hovered && animate ? 1 : 0.88}
        />
      </svg>

      {animate ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="absolute h-[9%] w-[9%] rounded-full border border-[#16a34a] will-change-transform"
            style={{
              animation: `hero-radar-ring ${RADAR_CORE_PULSE_S}s ease-out infinite`,
              filter: "blur(16px)",
            }}
          />
          <span
            className="absolute h-[9%] w-[9%] rounded-full border border-[#16a34a] will-change-transform"
            style={{
              animation: `hero-radar-ring ${RADAR_CORE_PULSE_S}s ease-out infinite`,
              animationDelay: "0.7s",
              filter: "blur(10px)",
            }}
          />
          <span
            className="absolute h-[2.9%] w-[2.9%] rounded-full bg-[#16a34a] will-change-transform"
            style={{
              animation: `hero-radar-core ${RADAR_CORE_PULSE_S}s ease-in-out infinite`,
              opacity: hovered ? 1 : 0.92,
            }}
          />
        </div>
      ) : null}
    </motion.div>
  );
}

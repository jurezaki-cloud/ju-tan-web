"use client";

import { CENTER_ATTR } from "./geometry";
import { RADAR_CORE_PULSE_S } from "@/hooks/useHeroRadarMotion";

type RadarCoreProps = {
  live: boolean;
  hovered: boolean;
  reduce: boolean;
};

export default function RadarCore({
  live,
  hovered,
  reduce,
}: RadarCoreProps) {
  const animate = live && !reduce;

  return (
    <div className="radar-parallax-core pointer-events-none absolute inset-0 will-change-transform">
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
    </div>
  );
}

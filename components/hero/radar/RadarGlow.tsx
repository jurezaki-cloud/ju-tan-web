"use client";

import { RADAR_GLOW_BREATHE_S } from "@/hooks/useHeroRadarMotion";

type RadarGlowProps = {
  live: boolean;
  hovered: boolean;
  reduce: boolean;
};

export default function RadarGlow({
  live,
  hovered,
  reduce,
}: RadarGlowProps) {
  return (
    <div
      className="radar-parallax-glow pointer-events-none absolute inset-[18%] will-change-transform"
      style={{ opacity: hovered && live ? 1 : 0.92 }}
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
    </div>
  );
}

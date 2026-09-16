"use client";

import { POINTS } from "./geometry";
import { RADAR_SWEEP_S } from "@/hooks/useHeroRadarMotion";

type RadarSweepProps = {
  active: boolean;
};

export default function RadarSweep({ active }: RadarSweepProps) {
  if (!active) return null;

  const period = `${RADAR_SWEEP_S}s`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transformOrigin: "50% 50%",
          animation: `hero-radar-sweep ${period} linear infinite`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(22,163,74,0.48) 0deg, transparent 0.6deg, transparent 327deg, rgba(22,163,74,0.03) 332deg, rgba(22,163,74,0.1) 342deg, rgba(22,163,74,0.26) 352deg, rgba(22,163,74,0.48) 360deg)",
          }}
        />
        <div
          className="absolute top-[6%] left-1/2 h-[44%] w-px bg-[#16a34a]"
          style={{
            marginLeft: "-0.5px",
            boxShadow: "0 0 8px rgba(22,163,74,0.55)",
            opacity: 0.92,
          }}
        />
      </div>

      {POINTS.map((point, index) => (
        <span
          key={`hit-${index}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-[#16a34a]"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            marginLeft: "-5px",
            marginTop: "-5px",
            opacity: 0,
            boxShadow: "0 0 12px rgba(22,163,74,0.7)",
            animation: `hero-radar-node-hit ${period} linear infinite`,
            animationDelay: `${(index / POINTS.length) * RADAR_SWEEP_S}s`,
          }}
        />
      ))}
    </div>
  );
}

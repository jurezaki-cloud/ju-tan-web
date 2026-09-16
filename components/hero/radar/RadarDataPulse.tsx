"use client";

import { POINTS } from "./geometry";
import {
  RADAR_FIRST_PULSE_MS,
  RADAR_PARTICLE_S,
  RADAR_PULSE_MIN_MS,
  RADAR_PULSE_SPAN_MS,
} from "@/hooks/useHeroRadarMotion";
import { useEffect, useState, type CSSProperties } from "react";

type Pulse = {
  id: number;
  x: string;
  y: string;
};

export default function RadarDataPulse({ active }: { active: boolean }) {
  const [pulse, setPulse] = useState<Pulse | null>(null);

  useEffect(() => {
    if (!active || POINTS.length === 0) return;

    let timeout = window.setTimeout(fire, RADAR_FIRST_PULSE_MS);

    function fire() {
      const point = POINTS[Math.floor(Math.random() * POINTS.length)];
      if (point) {
        setPulse({ id: Date.now(), x: `${point.x}%`, y: `${point.y}%` });
      }
      timeout = window.setTimeout(
        fire,
        RADAR_PULSE_MIN_MS + Math.random() * RADAR_PULSE_SPAN_MS,
      );
    }

    return () => window.clearTimeout(timeout);
  }, [active]);

  if (!active || !pulse) return null;

  return (
    <div
      key={pulse.id}
      className="pointer-events-none absolute inset-0 will-change-transform"
      style={
        {
          "--radar-pulse-x": pulse.x,
          "--radar-pulse-y": pulse.y,
          animation: `hero-radar-particle ${RADAR_PARTICLE_S}s ease-out 1 both`,
        } as CSSProperties
      }
    >
      <span
        className="absolute top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#16a34a]"
        style={{ boxShadow: "0 0 10px rgba(22,163,74,0.55)" }}
      />
    </div>
  );
}

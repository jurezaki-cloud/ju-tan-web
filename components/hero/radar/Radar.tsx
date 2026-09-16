"use client";

import { useRef } from "react";
import { useHeroRadarMotion } from "@/hooks/useHeroRadarMotion";
import RadarGlow from "./RadarGlow";
import RadarRings from "./RadarRings";
import RadarLabels from "./RadarLabels";
import RadarCore from "./RadarCore";
import RadarDataPulse from "./RadarDataPulse";
import RadarParallax from "./RadarParallax";
import RadarSweep from "./RadarSweep";

export default function Radar() {
  const stageRef = useRef<HTMLDivElement>(null);
  const radar = useHeroRadarMotion(stageRef);

  return (
    <div
      ref={stageRef}
      className="hero-radar relative mx-auto aspect-square h-auto w-full max-h-full [perspective:1400px]"
      aria-hidden
    >
      <RadarGlow
        live={radar.live}
        hovered={radar.hovered}
        reduce={radar.reduce}
        pointerX={radar.pointerX}
        pointerY={radar.pointerY}
      />

      <RadarParallax
        pointerX={radar.pointerX}
        pointerY={radar.pointerY}
        amount={10}
        reduce={radar.reduce}
      >
        <div className="absolute inset-0">
          <RadarRings />
          <RadarSweep active={radar.live && !radar.reduce} />
          <RadarDataPulse active={radar.live && !radar.reduce} />
        </div>
      </RadarParallax>

      <RadarParallax
        pointerX={radar.pointerX}
        pointerY={radar.pointerY}
        amount={10}
        reduce={radar.reduce}
      >
        <RadarLabels hovered={radar.hovered} />
      </RadarParallax>

      <RadarCore
        live={radar.live}
        hovered={radar.hovered}
        reduce={radar.reduce}
        pointerX={radar.pointerX}
        pointerY={radar.pointerY}
      />
    </div>
  );
}

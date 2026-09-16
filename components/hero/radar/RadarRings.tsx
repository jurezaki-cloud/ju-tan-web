import {
  CENTER_ATTR,
  MARKS,
  POINTS,
  RADAR_NODES,
} from "./geometry";

export default function RadarRings() {
  const filament = POINTS[0];

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      aria-hidden
    >
      <defs>
        <radialGradient id="hero-core-glow" cx="50%" cy="48%" r="52%">
          <stop offset="0%" stopColor="rgba(22,163,74,0.28)" />
          <stop offset="38%" stopColor="rgba(22,163,74,0.08)" />
          <stop offset="100%" stopColor="rgba(22,163,74,0)" />
        </radialGradient>
      </defs>

      <circle cx={CENTER_ATTR} cy={CENTER_ATTR} r="24" fill="url(#hero-core-glow)" />

      <line
        x1={CENTER_ATTR}
        y1="6"
        x2={CENTER_ATTR}
        y2="94"
        stroke="currentColor"
        strokeWidth="0.18"
        opacity="0.12"
      />
      <line
        x1="6"
        y1={CENTER_ATTR}
        x2="94"
        y2={CENTER_ATTR}
        stroke="currentColor"
        strokeWidth="0.18"
        opacity="0.12"
      />

      <circle
        cx={CENTER_ATTR}
        cy={CENTER_ATTR}
        r="44.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.18"
        strokeDasharray="0.7 1.5"
        opacity="0.22"
      />

      {(["14", "26", "38"] as const).map((radius) => (
        <circle
          key={radius}
          cx={CENTER_ATTR}
          cy={CENTER_ATTR}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.28"
          opacity="0.55"
        />
      ))}

      {MARKS.map((tick) => (
        <line
          key={tick.key}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke="currentColor"
          strokeWidth={tick.major ? "0.28" : "0.16"}
          opacity={tick.major ? "0.38" : "0.16"}
        />
      ))}

      {POINTS.map((point, index) => (
        <line
          key={`spoke-${RADAR_NODES[index]}`}
          x1={CENTER_ATTR}
          y1={CENTER_ATTR}
          x2={point.x}
          y2={point.y}
          stroke="currentColor"
          strokeWidth="0.22"
          opacity="0.22"
        />
      ))}

      {filament ? (
        <line
          x1={CENTER_ATTR}
          y1={CENTER_ATTR}
          x2={filament.x}
          y2={filament.y}
          stroke="#16a34a"
          strokeWidth="0.38"
          opacity="0.7"
        />
      ) : null}

      {POINTS.map((point, index) => (
        <circle
          key={`node-${RADAR_NODES[index]}`}
          cx={point.x}
          cy={point.y}
          r="0.85"
          fill="currentColor"
          opacity="0.72"
        />
      ))}
    </svg>
  );
}

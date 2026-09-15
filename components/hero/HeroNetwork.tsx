import { heroCopy } from "./copy";

function q(value: number) {
  return (Math.round(value * 10000) / 10000).toFixed(4);
}

const CENTER = 50;
const OUTER = 38;
const NODE_COUNT = heroCopy.network.nodes.length;
const TICK_COUNT = 72;
const CENTER_ATTR = q(CENTER);

type Point = { x: string; y: string; left: string; top: string };

function pointAt(index: number, total: number, radius: number): Point {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const x = CENTER + Math.cos(angle) * radius;
  const y = CENTER + Math.sin(angle) * radius;
  const outward = 1.12;
  return {
    x: q(x),
    y: q(y),
    left: q(CENTER + (x - CENTER) * outward),
    top: q(CENTER + (y - CENTER) * outward),
  };
}

const POINTS: Point[] = Array.from({ length: NODE_COUNT }, (_, index) =>
  pointAt(index, NODE_COUNT, OUTER),
);

const MARKS = Array.from({ length: TICK_COUNT }, (_, index) => {
  const angle = (index / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
  const major = index % 6 === 0;
  const inner = OUTER + (major ? 0.35 : 0.8);
  const outer = OUTER + (major ? 3.2 : 1.7);
  return {
    key: index,
    major,
    x1: q(CENTER + Math.cos(angle) * inner),
    y1: q(CENTER + Math.sin(angle) * inner),
    x2: q(CENTER + Math.cos(angle) * outer),
    y2: q(CENTER + Math.sin(angle) * outer),
  };
});

type HeroNetworkProps = {
  motion: boolean;
};

export default function HeroNetwork({ motion }: HeroNetworkProps) {
  const nodes = heroCopy.network.nodes;
  const filament = POINTS[0];

  return (
    <div className="relative h-full w-full text-white light:text-slate-800">
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
            key={`spoke-${nodes[index]}`}
            x1={CENTER_ATTR}
            y1={CENTER_ATTR}
            x2={point.x}
            y2={point.y}
            stroke="currentColor"
            strokeWidth="0.22"
            opacity="0.22"
            className={motion ? "hero-link-pulse" : undefined}
            style={motion ? { animationDelay: `${index * 0.55}s` } : undefined}
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
            key={`node-${nodes[index]}`}
            cx={point.x}
            cy={point.y}
            r="0.85"
            fill="currentColor"
            opacity="0.72"
          />
        ))}

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
          opacity="0.88"
        />
      </svg>

      {nodes.map((label, index) => {
        const point = POINTS[index];
        if (!point) return null;

        return (
          <div
            key={label}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 text-[8px] font-medium uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] light:text-slate-500 ${
              motion ? "hero-node-float" : ""
            }`}
            style={{
              left: `${point.left}%`,
              top: `${point.top}%`,
              animationDelay: motion ? `${index * 0.45}s` : undefined,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

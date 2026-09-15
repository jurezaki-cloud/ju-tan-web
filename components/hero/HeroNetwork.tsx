import { heroCopy } from "./copy";

const RADIUS = 38;
const CENTER = 50;

function nodePoint(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * RADIUS,
    y: CENTER + Math.sin(angle) * RADIUS,
  };
}

type HeroNetworkProps = {
  motion: boolean;
};

export default function HeroNetwork({ motion }: HeroNetworkProps) {
  const nodes = heroCopy.network.nodes;
  const points = nodes.map((_, index) => nodePoint(index, nodes.length));

  return (
    <div className="relative h-full w-full">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <defs>
          <radialGradient id="hero-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.35)" />
            <stop offset="70%" stopColor="rgba(16,185,129,0.06)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </radialGradient>
          <filter id="hero-line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r="28" fill="url(#hero-core-glow)" />

        {points.map((point, index) => (
          <line
            key={nodes[index]}
            x1={CENTER}
            y1={CENTER}
            x2={point.x}
            y2={point.y}
            stroke="rgba(74,222,128,0.42)"
            strokeWidth="0.45"
            filter="url(#hero-line-glow)"
            className={motion ? "hero-link-pulse" : undefined}
            style={motion ? { animationDelay: `${index * 0.35}s` } : undefined}
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 flex h-[5.6rem] w-[5.6rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-green-400/40 bg-[#07111f]/90 text-[13px] font-semibold tracking-[0.18em] text-green-200 shadow-[0_0_36px_rgba(34,197,94,0.35)] backdrop-blur-xl sm:h-28 sm:w-28 sm:text-[15px]">
        {heroCopy.network.center}
      </div>

      {nodes.map((label, index) => {
        const point = points[index];
        if (!point) return null;
        return (
          <div
            key={label}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-white/8 px-2.5 py-1.5 text-[10px] font-medium text-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-3 sm:text-[12px] ${
              motion ? "hero-node-float" : ""
            }`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              animationDelay: motion ? `${index * 0.28}s` : undefined,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

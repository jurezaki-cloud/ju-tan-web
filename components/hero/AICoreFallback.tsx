import { Activity, BarChart3, Gauge, Globe2 } from "lucide-react";
import { neuralGraphDesktop } from "@/lib/hero-neural";

const cards = [
  {
    title: "Analytics",
    detail: "Live metrics",
    icon: BarChart3,
    className: "top-[4%] left-0",
  },
  {
    title: "Performance",
    detail: "12 ms",
    icon: Gauge,
    className: "top-[4%] right-0",
  },
  {
    title: "World Network",
    detail: "Global mesh",
    icon: Globe2,
    className: "bottom-[6%] left-0",
  },
  {
    title: "AI Status",
    detail: "Online",
    icon: Activity,
    className: "bottom-[6%] right-0",
  },
] as const;

export function AnalyticsCards({ floating = false }: { floating?: boolean }) {
  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`glass pointer-events-none absolute z-10 max-w-[46%] rounded-xl border border-white/10 px-2.5 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl sm:max-w-none sm:rounded-2xl sm:px-3.5 sm:py-3 ${card.className} ${
              floating ? "hero-card-float" : ""
            }`}
            style={floating ? { animationDelay: `${index * 0.35}s` } : undefined}
          >
            <div className="mb-0.5 text-green-400">
              <Icon size={14} aria-hidden />
            </div>
            <p className="text-[11px] font-semibold leading-tight text-white sm:text-[13px]">
              {card.title}
            </p>
            <p className="text-[10px] text-slate-400 sm:text-[12px]">{card.detail}</p>
          </div>
        );
      })}
    </>
  );
}

export default function AICoreFallback() {
  const { nodes, edges } = neuralGraphDesktop;

  return (
    <svg
      className="absolute inset-[6%] h-[88%] w-[88%]"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
        {edges.map((edge) => {
          const a = nodes[edge.a];
          const b = nodes[edge.b];
          return (
            <line
              key={`${edge.a}-${edge.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(74,222,128,0.28)"
              strokeWidth="0.35"
            />
          );
        })}
        {nodes.map((node, index) => (
          <circle
            key={index}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="#22c55e"
            opacity="0.85"
          />
        ))}
      </svg>
  );
}

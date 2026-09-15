"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, BarChart3, Gauge, Globe2 } from "lucide-react";
import { neuralGraphDesktop, headProfile } from "@/lib/hero-neural";
import { heroCopy } from "./copy";

const statuses = heroCopy.dashboard.statuses;

const cards = [
  {
    id: "analytics",
    title: heroCopy.dashboard.analytics.title,
    detail: heroCopy.dashboard.analytics.detail,
    icon: BarChart3,
    className: "top-[4%] left-0",
  },
  {
    id: "performance",
    title: heroCopy.dashboard.performance.title,
    detail: heroCopy.dashboard.performance.detail,
    icon: Gauge,
    className: "top-[4%] right-0",
  },
  {
    id: "world",
    title: heroCopy.dashboard.world.title,
    detail: heroCopy.dashboard.world.detail,
    icon: Globe2,
    className: "bottom-[6%] left-0",
  },
  {
    id: "status",
    title: heroCopy.dashboard.status.title,
    detail: statuses[0],
    icon: Activity,
    className: "bottom-[6%] right-0",
  },
] as const;

function WorldMesh({ motion }: { motion: boolean }) {
  return (
    <svg
      className="mt-1 h-2.5 w-full max-w-[5.5rem]"
      viewBox="0 0 72 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 6 C18 2 28 10 36 6 C46 1 56 11 70 6"
        stroke="rgba(74,222,128,0.45)"
        strokeWidth="0.8"
      />
      <circle cx="8" cy="5.2" r="1.2" fill="#4ade80" />
      <circle cx="36" cy="6" r="1.2" fill="#4ade80" />
      <circle cx="64" cy="5.6" r="1.2" fill="#4ade80" />
      {motion ? (
        <>
          <circle className="hero-mesh-dot" r="1.35" fill="#bbf7d0" />
          <circle
            className="hero-mesh-dot"
            r="1.35"
            fill="#86efac"
            style={{ animationDelay: "1.1s" }}
          />
        </>
      ) : null}
    </svg>
  );
}

function StatusCycle({ motion }: { motion: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!motion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % statuses.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [motion]);

  const current = motion ? statuses[index] : statuses[0];

  return (
    <span className="grid text-[10px] text-slate-400 sm:text-[12px]">
      {statuses.map((status) => (
        <span
          key={status}
          className="col-start-1 row-start-1 transition-opacity duration-500"
          style={{ opacity: status === current ? 1 : 0 }}
        >
          {status}
        </span>
      ))}
    </span>
  );
}

export function AnalyticsCards({ floating = false }: { floating?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"hidden" | "enter" | "live">(
    floating ? "hidden" : "live",
  );

  useEffect(() => {
    if (!floating) return;
    const node = rootRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase("enter");
        window.setTimeout(() => setPhase("live"), 560);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [floating]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const motionClass =
          phase === "hidden"
            ? "opacity-0"
            : phase === "enter"
              ? "hero-card-enter"
              : floating
                ? "hero-card-float"
                : "";

        return (
          <div
            key={card.id}
            className={`glass pointer-events-none absolute z-10 max-w-[46%] rounded-xl border border-white/10 px-2.5 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl sm:max-w-none sm:rounded-2xl sm:px-3.5 sm:py-3 ${card.className} ${motionClass}`}
            style={
              phase === "enter"
                ? { animationDelay: `${index * 90}ms` }
                : floating && phase === "live"
                  ? { animationDelay: `${index * 0.35}s` }
                  : undefined
            }
          >
            <div className="mb-0.5 text-green-400">
              <Icon size={14} aria-hidden />
            </div>
            <p className="text-[11px] font-semibold leading-tight text-white sm:text-[13px]">
              {card.title}
            </p>
            {card.id === "status" ? (
              <StatusCycle motion={floating} />
            ) : card.id === "world" ? (
              <>
                <p className="text-[10px] text-slate-400 sm:text-[12px]">
                  {card.detail}
                </p>
                <WorldMesh motion={floating} />
              </>
            ) : (
              <p className="text-[10px] text-slate-400 sm:text-[12px]">
                {card.detail}
              </p>
            )}
          </div>
        );
      })}
    </div>
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
      <polygon
        points={headProfile.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="rgba(34,197,94,0.07)"
      />
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
            strokeWidth={a.rim && b.rim ? "0.55" : "0.32"}
          />
        );
      })}
      {nodes.map((item, index) => (
        <circle
          key={index}
          cx={item.x}
          cy={item.y}
          r={item.r}
          fill="#22c55e"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}

"use client";

import { motion, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import CoreMark from "@/components/common/CoreMark";
import { useHeroRadarMotion } from "@/hooks/useHeroRadarMotion";
import { cn } from "@/lib/utils";
import { heroCopy } from "./copy";

const stageModules = [
  {
    id: "splet",
    label: "Splet",
    left: "27%",
    top: "28%",
    path: "M50 50 C43 45 35 38 28 30",
    widthClass: "",
    signalDelay: 1.15,
  },
  {
    id: "aplikacije",
    label: "Aplikacije",
    left: "50%",
    top: "18%",
    path: "M50 50 C50 42 50 32 50 21",
    widthClass: "min-w-[6.6rem] sm:min-w-[8.4rem]",
    signalDelay: 2.35,
  },
  {
    id: "podatki",
    label: "Podatki",
    left: "73%",
    top: "28%",
    path: "M50 50 C57 45 65 38 72 30",
    widthClass: "",
    signalDelay: 3.6,
  },
  {
    id: "poslovni-sistemi",
    label: "Poslovni sistemi",
    left: "27%",
    top: "72%",
    path: "M50 50 C43 55 35 62 28 70",
    widthClass: "",
    signalDelay: 4.9,
  },
  {
    id: "integracije",
    label: "Integracije",
    left: "50%",
    top: "82%",
    path: "M50 50 C50 58 50 68 50 79",
    widthClass: "min-w-[6.6rem] sm:min-w-[8.4rem]",
    signalDelay: 6.2,
  },
  {
    id: "ai",
    label: "AI",
    left: "73%",
    top: "72%",
    path: "M50 50 C57 55 65 62 72 70",
    widthClass: "",
    signalDelay: 7.35,
  },
] as const;

export default function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const { hovered, live, pointerX, pointerY, reduce } = useHeroRadarMotion(stageRef);
  const frameX = useTransform(pointerX, (value) => value * 0.9);
  const frameY = useTransform(pointerY, (value) => value * 0.9);
  const networkX = useTransform(pointerX, (value) => value * 1.6);
  const networkY = useTransform(pointerY, (value) => value * 1.6);
  const ambientActive = live && !reduce && activeNodeId === null;
  const enterClassName = "hero-stage-enter";

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-[14%] top-5 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.14),transparent)]" />
      <div className="pointer-events-none absolute left-[14%] top-14 bottom-14 hidden w-px bg-[linear-gradient(to_bottom,rgba(22,163,74,0),rgba(148,163,184,0.14),rgba(22,163,74,0))] sm:block" />
      <div className="pointer-events-none absolute right-[14%] top-14 bottom-14 hidden w-px bg-[linear-gradient(to_bottom,rgba(22,163,74,0),rgba(148,163,184,0.14),rgba(22,163,74,0))] sm:block" />

      <div
        ref={stageRef}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,28,0.96),rgba(6,10,20,0.92))] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.36)] light:border-slate-200 light:bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] sm:p-4"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] light:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.24) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.12),transparent_70%)]" />

        <div
          className={cn(
            enterClassName,
            "relative flex items-center justify-between gap-3 rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-3.5 py-2.5 light:border-slate-200 light:bg-white/80",
          )}
          style={reduce ? undefined : { animationDelay: "0.18s" }}
        >
          <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300 light:text-slate-700">
            <CoreMark className="h-3.5 w-3.5 shrink-0 text-[#16a34a]" />
            {heroCopy.stage.eyebrow}
          </div>
          <div className="rounded-full border border-[#16a34a]/25 bg-[#16a34a]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#86efac] light:text-[#166534]">
            {heroCopy.stage.status}
          </div>
        </div>

        <div
          className={cn(
            enterClassName,
            "relative mt-3 overflow-hidden rounded-[1.55rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-3 py-3.5 light:border-slate-200 light:bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.92))] sm:px-4 sm:py-5",
          )}
          style={reduce ? undefined : { animationDelay: "0.34s" }}
        >
          <div className="mx-auto max-w-[16rem] text-center sm:max-w-[18rem]">
            <p
              className={cn(enterClassName, "text-[15px] font-semibold tracking-[-0.025em] text-white light:text-slate-900")}
              style={reduce ? undefined : { animationDelay: "0.38s" }}
            >
              {heroCopy.stage.title}
            </p>
            <p
              className={cn(
                enterClassName,
                "mt-1.5 hidden text-[12px] leading-[1.6] text-slate-500/78 light:text-slate-500 sm:block",
              )}
              style={reduce ? undefined : { animationDelay: "0.44s" }}
            >
              {heroCopy.stage.description}
            </p>
          </div>

          <div className="relative mx-auto mt-4 aspect-[1.08/1] w-full max-w-[18rem] sm:mt-5 sm:max-w-[21.8rem]">
            <div className={cn(enterClassName, "absolute inset-0")} style={reduce ? undefined : { animationDelay: "0.5s" }}>
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={reduce ? undefined : { x: frameX, y: frameY }}
              >
                <div className="hero-stage-panel-ambient absolute inset-x-[7.5%] top-[8%] h-[84%] rounded-[2rem] border border-white/6 bg-[linear-gradient(180deg,rgba(15,23,42,0.14),rgba(15,23,42,0.05))] light:border-slate-200/70 light:bg-[linear-gradient(180deg,rgba(255,255,255,0.66),rgba(248,250,252,0.78))]" />
                <div className="absolute inset-[21%] rounded-[1.75rem] bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.06),transparent_66%)] light:bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.04),transparent_66%)]" />
                <div className="absolute inset-x-[24%] top-[18%] h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.22),transparent)]" />
                <div className="absolute inset-x-[24%] bottom-[18%] h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.2),transparent)]" />
                <div className="absolute inset-y-[24%] left-[18%] w-px bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.16),transparent)]" />
                <div className="absolute inset-y-[24%] right-[18%] w-px bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.16),transparent)]" />
              </motion.div>
            </div>

            <div className={cn(enterClassName, "absolute inset-0")} style={reduce ? undefined : { animationDelay: "0.58s" }}>
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={reduce ? undefined : { x: networkX, y: networkY }}
              >
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
                  {stageModules.map((module) => {
                    const active = activeNodeId === module.id;
                    const dimmed = activeNodeId !== null && !active;

                    return (
                      <g key={module.id}>
                        <path
                          d={module.path}
                          fill="none"
                          stroke={dimmed ? "rgba(148,163,184,0.13)" : "rgba(148,163,184,0.22)"}
                          strokeWidth={active ? "0.82" : "0.7"}
                          strokeLinecap="round"
                        />
                        {ambientActive ? (
                          <path
                            d={module.path}
                            fill="none"
                            stroke="rgba(134,239,172,0.88)"
                            strokeWidth="1.05"
                            strokeLinecap="round"
                            strokeDasharray="8 120"
                            className="hero-stage-signal"
                            style={{
                              animationDelay: `${module.signalDelay}s`,
                              animationDuration: `${8.8 + (module.signalDelay % 1.5)}s`,
                            }}
                          />
                        ) : null}
                        {active ? (
                          <path
                            d={module.path}
                            fill="none"
                            stroke="rgba(134,239,172,0.72)"
                            strokeWidth="1.08"
                            strokeLinecap="round"
                          />
                        ) : null}
                      </g>
                    );
                  })}

                  <circle cx="50" cy="50" r="18" fill="rgba(22,163,74,0.05)" />
                  <circle
                    cx="50"
                    cy="50"
                    r="13.5"
                    fill="none"
                    stroke={activeNodeId ? "rgba(134,239,172,0.28)" : "rgba(148,163,184,0.18)"}
                    strokeWidth="0.75"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="26.5"
                    fill="none"
                    stroke={hovered || activeNodeId ? "rgba(134,239,172,0.22)" : "rgba(148,163,184,0.12)"}
                    strokeWidth="0.7"
                    strokeDasharray="1.25 3.4"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                style={reduce ? undefined : { x: networkX, y: networkY }}
              >
                {stageModules.map((module, index) => {
                  const active = activeNodeId === module.id;
                  const dimmed = activeNodeId !== null && !active;

                  return (
                    <div
                      key={module.id}
                      className={cn(
                        enterClassName,
                        "pointer-events-auto absolute z-10",
                        dimmed ? "opacity-[0.62]" : "opacity-100",
                      )}
                      style={
                        reduce
                          ? { left: module.left, top: module.top }
                          : {
                              left: module.left,
                              top: module.top,
                              animationDelay: `${0.66 + index * 0.04}s`,
                            }
                      }
                    >
                      <button
                        type="button"
                        aria-label={`${module.label} v digitalnem ekosistemu JU-TAN`}
                        onPointerEnter={() => setActiveNodeId(module.id)}
                        onPointerLeave={() => setActiveNodeId((current) => (current === module.id ? null : current))}
                        onFocus={() => setActiveNodeId(module.id)}
                        onBlur={() => setActiveNodeId((current) => (current === module.id ? null : current))}
                        className={cn(
                          "relative flex min-w-[6rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full border bg-[linear-gradient(180deg,rgba(12,18,30,0.82),rgba(12,18,30,0.7))] px-3 py-2 shadow-[0_16px_28px_rgba(0,0,0,0.2)] backdrop-blur-[3px] transition-[opacity,transform,border-color,background-color,box-shadow] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86efac]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09111d] light:bg-white/90 light:focus-visible:ring-offset-white sm:min-w-[7.8rem] sm:px-4 sm:py-2.5",
                          module.widthClass,
                          active
                            ? "border-[#86efac]/58 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(12,18,30,0.8))] shadow-[0_18px_34px_rgba(4,12,24,0.3)] light:border-[#16a34a]/30 light:bg-white"
                            : "border-white/10 light:border-slate-200",
                        )}
                      >
                        {ambientActive ? (
                          <span
                            className="hero-stage-node-idle absolute inset-0 rounded-full border border-[#86efac]/35 opacity-0"
                            style={{ animationDelay: `${1 + index * 1.18}s` }}
                            aria-hidden
                          />
                        ) : null}
                        <span
                          className={cn(
                            "pointer-events-none absolute inset-0 rounded-full border transition-opacity duration-300",
                            active ? "border-[#86efac]/48 opacity-100" : "border-transparent opacity-0",
                          )}
                          aria-hidden
                        />
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition-[opacity,transform,background-color] duration-300",
                            active ? "scale-110 bg-[#86efac]" : "bg-[#16a34a]",
                          )}
                          aria-hidden
                        />
                        <span
                          className={cn(
                            "text-[11px] font-semibold tracking-[-0.02em] transition-colors duration-300 sm:text-[13px]",
                            active ? "text-[#f0fdf4] light:text-slate-950" : "text-white light:text-slate-900",
                          )}
                        >
                          {module.label}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </motion.div>

              <motion.div
                className="pointer-events-none absolute inset-0 z-10"
                style={reduce ? undefined : { x: networkX, y: networkY }}
              >
                <div
                  className={cn(enterClassName, "pointer-events-none absolute left-1/2 top-1/2 z-10")}
                  style={reduce ? undefined : { animationDelay: "0.7s" }}
                >
                  <div
                    className={cn(
                      "hero-stage-core-breathe w-[6.8rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.35rem] border bg-[linear-gradient(180deg,rgba(22,163,74,0.12),rgba(11,17,29,0.94))] px-3 py-3 text-center shadow-[0_22px_44px_rgba(0,0,0,0.28)] transition-[border-color,box-shadow,background-color,opacity] duration-300 light:bg-[linear-gradient(180deg,rgba(240,253,244,0.96),rgba(255,255,255,0.94))] sm:w-[8.15rem] sm:px-4 sm:py-3.5",
                      activeNodeId || hovered
                        ? "border-[#86efac]/32 light:border-[#16a34a]/26"
                        : "border-[#16a34a]/20 light:border-[#16a34a]/20",
                    )}
                  >
                    <div
                      className={cn(
                        "mx-auto flex h-9 w-9 items-center justify-center rounded-[1rem] border text-[#16a34a] transition-[border-color,background-color,box-shadow,opacity] duration-300 light:bg-[#16a34a]/12 sm:h-10 sm:w-10",
                        activeNodeId || hovered
                          ? "border-[#86efac]/28 bg-[#16a34a]/14 shadow-[0_0_0_1px_rgba(134,239,172,0.12)]"
                          : "border-[#16a34a]/20 bg-[#16a34a]/10",
                      )}
                    >
                      <CoreMark className="h-[1.125rem] w-[1.125rem]" />
                    </div>
                    <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white light:text-slate-900 sm:mt-3 sm:text-[13px]">
                      JU-TAN
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes hero-stage-panel-ambient {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -4px, 0);
          }
        }

        @keyframes hero-stage-enter {
          from {
            opacity: 0.72;
            transform: translate3d(0, 6px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes hero-stage-core-breathe {
          0%,
          100% {
            box-shadow:
              0 22px 44px rgba(0, 0, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.04);
            opacity: 0.98;
          }
          50% {
            box-shadow:
              0 24px 48px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(134, 239, 172, 0.07),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
            opacity: 1;
          }
        }

        @keyframes hero-stage-node-idle {
          0%,
          100% {
            opacity: 0;
          }
          8% {
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          24% {
            opacity: 0;
          }
        }

        @keyframes hero-stage-signal {
          0%,
          72% {
            opacity: 0;
            stroke-dashoffset: 0;
          }
          78% {
            opacity: 0.82;
          }
          92% {
            opacity: 0.64;
            stroke-dashoffset: -48;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: -58;
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .hero-stage-enter {
            animation: hero-stage-enter 0.34s var(--ease-premium) both;
          }

          .hero-stage-panel-ambient {
            animation: hero-stage-panel-ambient 18s ease-in-out infinite;
          }

          .hero-stage-core-breathe {
            animation: hero-stage-core-breathe 6.4s ease-in-out infinite;
          }

          .hero-stage-node-idle {
            animation: hero-stage-node-idle 14s ease-in-out infinite;
          }

          .hero-stage-signal {
            animation-name: hero-stage-signal;
            animation-timing-function: ease-out;
            animation-iteration-count: infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-stage-enter {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

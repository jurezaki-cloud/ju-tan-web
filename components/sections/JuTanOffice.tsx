"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import CtaLink from "@/components/navbar/CtaLink";
import { bodyClass, easeOut, focusRing, kickerClass } from "@/design";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type ModuleId = "stranke" | "artikli" | "pregled" | "ponudbe";

type ProductModule = {
  id: ModuleId;
  label: string;
  desktopClassName: string;
  path: string;
  delay: number;
  future?: boolean;
  status?: string;
};

const currentModules: ProductModule[] = [
  {
    id: "stranke",
    label: "Stranke",
    desktopClassName: "left-[4%] top-[10%]",
    path: "M38 37 C32 31 25 26 18 22",
    delay: 0.16,
  },
  {
    id: "artikli",
    label: "Artikli",
    desktopClassName: "right-[3%] top-[15%]",
    path: "M62 39 C68 34 75 30 82 27",
    delay: 0.24,
  },
  {
    id: "pregled",
    label: "Poslovni pregled",
    desktopClassName: "left-[10%] bottom-[13%]",
    path: "M39 66 C33 71 27 74 22 77",
    delay: 0.32,
  },
];

const futureModule: ProductModule = {
  id: "ponudbe",
  label: "Ponudbe",
  status: "V razvoju",
  desktopClassName: "right-[7%] bottom-[11%]",
  path: "M61 66 C67 69 73 72 79 74",
  delay: 0.4,
  future: true,
};

const productAreas: Array<Pick<ProductModule, "id" | "label">> = [
  { id: "stranke", label: "Stranke" },
  { id: "artikli", label: "Artikli" },
  { id: "pregled", label: "Poslovni pregled" },
];

function ModuleNode({
  item,
  activeId,
  reduceMotion,
  onActivate,
  onDeactivate,
  mobile = false,
}: {
  item: ProductModule;
  activeId: ModuleId | null;
  reduceMotion: boolean;
  onActivate: (id: ModuleId) => void;
  onDeactivate: () => void;
  mobile?: boolean;
}) {
  const isActive = activeId === item.id;
  const isDimmed = activeId !== null && activeId !== item.id;

  return (
    <motion.button
      type="button"
      onMouseEnter={() => onActivate(item.id)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(item.id)}
      onBlur={onDeactivate}
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
              scale: 1,
            }
      }
      viewport={{ once: true, amount: mobile ? 0.2 : 0.45 }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.45,
        delay: reduceMotion ? 0 : item.delay,
        ease: easeOut,
      }}
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border px-4 py-3 text-left",
        "bg-[linear-gradient(180deg,rgba(10,16,18,0.9),rgba(6,10,12,0.9))]",
        "shadow-[0_18px_42px_rgba(0,0,0,0.22)] transition-[transform,border-color,opacity,box-shadow,background-color] duration-300",
        focusRing,
        mobile ? "w-full" : `absolute w-[10.75rem] ${item.desktopClassName}`,
        item.future
          ? "border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(9,14,16,0.72),rgba(6,9,11,0.72))]"
          : "border-white/10",
        isActive &&
          (item.future
            ? "border-[#16a34a]/26 shadow-[0_22px_46px_rgba(4,120,87,0.1)]"
            : "-translate-y-0.5 border-[#16a34a]/28 shadow-[0_24px_52px_rgba(4,120,87,0.12)]"),
        isDimmed && "opacity-45",
      )}
      aria-label={item.future ? `${item.label} - ${item.status}` : item.label}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2),transparent)]",
          isActive && "bg-[linear-gradient(to_right,transparent,rgba(134,239,172,0.42),transparent)]",
        )}
      />
      <p className="text-[14px] font-semibold tracking-[-0.03em] text-white">
        {item.label}
      </p>
      {item.future ? (
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {item.status}
        </p>
      ) : null}
    </motion.button>
  );
}

export default function JuTanOffice() {
  const reduceMotion = usePrefersReducedMotion();
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);
  const allModules = [...currentModules, futureModule];
  const hasActiveModule = activeModule !== null;

  return (
    <Section
      id="office"
      belowFold
      labelledBy="office-title"
      className="scroll-mt-28 bg-[#020807]"
      innerClassName="overflow-x-hidden"
      decorate={
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(22,163,74,0.1),transparent_26%),radial-gradient(circle_at_82%_24%,rgba(148,163,184,0.08),transparent_24%),linear-gradient(180deg,rgba(2,8,7,0.98),rgba(4,10,12,1))]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.16),transparent)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.12),transparent)]"
            aria-hidden
          />
        </>
      }
    >
      <div className="pt-6 sm:pt-8 lg:pt-12">
        <div className="mx-auto grid w-full max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.12fr)] lg:items-center lg:gap-14">
          <FadeIn>
            <div className="max-w-[36rem]">
              <p className={kickerClass}>IZDELEK JU-TAN</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#86efac]">
                  JU-TAN Office
                </p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
                  V AKTIVNEM RAZVOJU
                </span>
              </div>

              <p className="mt-5 text-[clamp(1.8rem,calc(1.35rem+1.9vw),2.85rem)] font-heading font-semibold leading-[1.08] tracking-[-0.05em] text-white">
                JU-TAN Office
              </p>

              <h2
                id="office-title"
                className="mt-4 max-w-[10ch] text-[clamp(1.55rem,calc(1.32rem+1.05vw),2.45rem)] font-heading font-semibold leading-[1.14] tracking-[-0.045em] text-white"
              >
                Poslovanje na enem mestu.
              </h2>

              <p className={`${bodyClass} mt-5 max-w-[35rem] text-slate-300`}>
                JU-TAN Office je lastna poslovna platforma JU-TAN v aktivnem
                razvoju, zasnovana za povezovanje ključnih podatkov in
                vsakodnevnih poslovnih procesov v enem okolju.
              </p>

              <p className={`${bodyClass} mt-4 max-w-[34rem] text-slate-400`}>
                Razvijamo ga kot dolgoročno platformo, ki lahko raste skupaj s
                podjetjem in njegovimi procesi.
              </p>

              <p className="mt-5 text-[12px] uppercase tracking-[0.18em] text-slate-500">
                Namizna aplikacija · Python · PySide6
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CtaLink
                  href="/#booking"
                  variant="secondary"
                  aria-label="Spoznajte JU-TAN Office in oddajte povpraševanje"
                  className="border-white/14 bg-white/[0.03] text-white hover:border-[#16a34a]/26 hover:bg-white/[0.05]"
                >
                  Spoznajte JU-TAN Office
                </CtaLink>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative mx-auto w-full max-w-[47rem] lg:pt-4">
              <motion.div
                className="pointer-events-none absolute inset-[16%] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.1),transparent_66%)] blur-3xl"
                aria-hidden
                animate={reduceMotion ? undefined : { opacity: [0.2, 0.32, 0.2] }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              <div className="relative overflow-hidden rounded-[2.1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(5,11,12,0.96),rgba(5,9,11,0.98))] p-4 shadow-[0_34px_100px_rgba(0,0,0,0.38)] sm:p-6 lg:p-7">
                <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_72%)]" />
                <div className="absolute inset-x-[18%] top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.16),transparent)]" />
                <div className="absolute inset-x-[22%] bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.12),transparent)]" />

                <div className="relative hidden min-h-[34rem] md:block">
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    aria-hidden
                  >
                    {allModules.map((item) => {
                      const isActive = activeModule === item.id;
                      const isDimmed =
                        activeModule !== null && activeModule !== item.id;

                      return (
                        <motion.path
                          key={item.id}
                          d={item.path}
                          fill="none"
                          stroke={
                            item.future
                              ? isActive
                                ? "rgba(134,239,172,0.66)"
                                : "rgba(148,163,184,0.2)"
                              : isActive
                                ? "rgba(134,239,172,0.78)"
                                : "rgba(148,163,184,0.26)"
                          }
                          strokeWidth={isActive ? 0.96 : item.future ? 0.68 : 0.82}
                          strokeLinecap="round"
                          strokeDasharray={item.future ? "1.8 2.6" : undefined}
                          initial={
                            reduceMotion ? false : { pathLength: 0, opacity: 0 }
                          }
                          whileInView={
                            reduceMotion
                              ? undefined
                              : {
                                  pathLength: 1,
                                  opacity: isDimmed ? 0.2 : 1,
                                }
                          }
                          animate={
                            reduceMotion
                              ? undefined
                              : {
                                  opacity: isActive
                                    ? 1
                                    : isDimmed
                                      ? 0.18
                                      : item.future
                                        ? [0.18, 0.32, 0.18]
                                        : [0.26, 0.42, 0.26],
                                }
                          }
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{
                            duration: isActive ? 0.25 : item.future ? 5.2 : 4.6,
                            delay: reduceMotion ? 0 : item.delay,
                            repeat:
                              reduceMotion || isActive
                                ? 0
                                : Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      );
                    })}
                  </svg>

                  {currentModules.map((item) => (
                    <ModuleNode
                      key={item.id}
                      item={item}
                      activeId={activeModule}
                      reduceMotion={reduceMotion}
                      onActivate={setActiveModule}
                      onDeactivate={() => setActiveModule(null)}
                    />
                  ))}

                  <ModuleNode
                    item={futureModule}
                    activeId={activeModule}
                    reduceMotion={reduceMotion}
                    onActivate={setActiveModule}
                    onDeactivate={() => setActiveModule(null)}
                  />

                  <motion.div
                    className="absolute left-1/2 top-1/2 w-[61%] max-w-[28rem] -translate-x-1/2 -translate-y-1/2"
                    initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
                    whileInView={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }
                    }
                    animate={
                      reduceMotion
                        ? undefined
                        : hasActiveModule
                          ? { scale: 1.012, y: -2 }
                          : { scale: [1, 1.008, 1], y: [0, -2, 0] }
                    }
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: hasActiveModule ? 0.35 : 8,
                      delay: reduceMotion ? 0 : 0.12,
                      repeat:
                        reduceMotion || hasActiveModule
                          ? 0
                          : Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-[2rem] border bg-[linear-gradient(180deg,rgba(7,12,14,0.99),rgba(5,9,11,0.98))] p-4 shadow-[0_30px_72px_rgba(0,0,0,0.32)]",
                        hasActiveModule
                          ? "border-[#16a34a]/22"
                          : "border-white/10",
                      )}
                    >
                      <motion.div
                        className="absolute inset-x-[16%] top-10 h-24 rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.1),transparent_72%)] blur-3xl"
                        aria-hidden
                        animate={
                          reduceMotion
                            ? undefined
                            : hasActiveModule
                              ? { opacity: 0.38, scale: 1.03 }
                              : { opacity: [0.22, 0.34, 0.22], scale: [0.98, 1.01, 0.98] }
                        }
                        transition={{
                          duration: hasActiveModule ? 0.35 : 8.5,
                          repeat:
                            reduceMotion || hasActiveModule
                              ? 0
                              : Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />

                      <div className="relative flex items-center gap-2 px-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-white/65" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/28" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/18" />
                      </div>

                      <div className="relative mt-4 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(13,20,23,0.92),rgba(8,13,15,0.98))] px-7 py-8">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08),transparent_48%)]" />
                        <div className="absolute inset-x-7 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.18),transparent)]" />

                        <div className="relative">
                          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.28em] text-white/78">
                            JU-TAN
                          </p>
                          <p className="mt-2 text-[clamp(4.15rem,8.4vw,5.6rem)] font-heading font-semibold leading-[0.92] tracking-[-0.095em] text-white [text-shadow:0_10px_32px_rgba(255,255,255,0.06)]">
                            Office
                          </p>

                          <div className="mt-5 h-px w-16 bg-[linear-gradient(to_right,rgba(134,239,172,0.42),transparent)]" />

                          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] tracking-[0.01em]">
                            {productAreas.map((item, index) => {
                              const isActive = activeModule === item.id;
                              const isDimmed =
                                activeModule !== null && activeModule !== item.id;

                              return (
                                <span
                                  key={item.id}
                                  className="flex items-center gap-2"
                                >
                                  {index > 0 ? (
                                    <span className="text-slate-600">·</span>
                                  ) : null}
                                  <span
                                    className={cn(
                                      "font-medium transition-colors duration-300",
                                      isActive
                                        ? "text-white"
                                        : isDimmed
                                          ? "text-slate-500"
                                          : "text-white/74",
                                    )}
                                  >
                                    {item.label}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="md:hidden">
                  <motion.div
                    className={cn(
                      "rounded-[1.7rem] border bg-[linear-gradient(180deg,rgba(6,12,14,0.98),rgba(4,8,10,0.96))] p-3.5 shadow-[0_28px_60px_rgba(0,0,0,0.26)]",
                      hasActiveModule ? "border-[#16a34a]/22" : "border-white/10",
                    )}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    animate={
                      reduceMotion
                        ? undefined
                        : hasActiveModule
                          ? { scale: 1.01 }
                          : { scale: [1, 1.006, 1] }
                    }
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: hasActiveModule ? 0.3 : 7.5,
                      delay: reduceMotion ? 0 : 0.1,
                      repeat:
                        reduceMotion || hasActiveModule
                          ? 0
                          : Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(13,20,23,0.92),rgba(8,13,15,0.98))] px-5 py-6">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-white/65" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/28" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/18" />
                      </div>

                      <div className="mt-5">
                        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.28em] text-white/78">
                          JU-TAN
                        </p>
                        <p className="mt-2 text-[3.2rem] font-heading font-semibold leading-[0.94] tracking-[-0.09em] text-white [text-shadow:0_10px_28px_rgba(255,255,255,0.06)]">
                          Office
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] tracking-[0.01em]">
                          {productAreas.map((item, index) => {
                            const isActive = activeModule === item.id;
                            const isDimmed =
                              activeModule !== null && activeModule !== item.id;

                            return (
                              <span key={item.id} className="flex items-center gap-2">
                                {index > 0 ? (
                                  <span className="text-slate-600">·</span>
                                ) : null}
                                <span
                                  className={cn(
                                    "font-medium transition-colors duration-300",
                                    isActive
                                      ? "text-white"
                                      : isDimmed
                                        ? "text-slate-500"
                                        : "text-white/74",
                                  )}
                                >
                                  {item.label}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="relative mx-auto mt-5 max-w-[22rem] pt-6">
                    <div className="pointer-events-none absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(134,239,172,0.35),rgba(148,163,184,0.02))]" />
                    <div className="grid gap-3">
                      {currentModules.map((item) => (
                        <ModuleNode
                          key={item.id}
                          item={item}
                          activeId={activeModule}
                          reduceMotion={reduceMotion}
                          onActivate={setActiveModule}
                          onDeactivate={() => setActiveModule(null)}
                          mobile
                        />
                      ))}
                      <ModuleNode
                        item={futureModule}
                        activeId={activeModule}
                        reduceMotion={reduceMotion}
                        onActivate={setActiveModule}
                        onDeactivate={() => setActiveModule(null)}
                        mobile
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

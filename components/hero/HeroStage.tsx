import CoreMark from "@/components/common/CoreMark";
import { heroCopy } from "./copy";
import { cn } from "@/lib/utils";

const moduleDescriptions = [
  "Vloge, stranke in dogovori ostanejo vezani na isto jedro.",
  "Naloge, dokumenti in odobritve sledijo istemu stanju procesa.",
  "Obstoječa orodja delijo isti podatkovni model in ista pravila.",
  "Rutinska opravila tečejo nad povezanimi podatki, ne ob strani.",
] as const;

const modulePositions = [
  { left: "18%", top: "21%" },
  { left: "82%", top: "25%" },
  { left: "22%", top: "79%" },
  { left: "78%", top: "74%" },
] as const;

const connectorPaths = [
  "M50 50 C40 46 31 38 22 26",
  "M50 50 C62 45 72 37 79 30",
  "M50 50 C39 58 31 66 24 74",
  "M50 50 C61 57 69 63 76 71",
] as const;

export default function HeroStage() {
  return (
    <div className="relative">
      <div className="absolute inset-x-[12%] top-6 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.16),transparent)]" />
      <div className="absolute left-[14%] top-16 bottom-16 hidden w-px bg-[linear-gradient(to_bottom,rgba(22,163,74,0),rgba(148,163,184,0.18),rgba(22,163,74,0))] sm:block" />
      <div className="absolute right-[14%] top-16 bottom-16 hidden w-px bg-[linear-gradient(to_bottom,rgba(22,163,74,0),rgba(148,163,184,0.18),rgba(22,163,74,0))] sm:block" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,28,0.96),rgba(6,10,20,0.92))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] light:border-slate-200 light:bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] sm:p-5">
        <div className="absolute inset-0 opacity-[0.08] light:opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.32) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.12),transparent_70%)]" />

        <div className="relative flex items-center justify-between gap-3 rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3 light:border-slate-200 light:bg-white/80">
          <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300 light:text-slate-700">
            <CoreMark className="h-3.5 w-3.5 shrink-0 text-[#16a34a]" />
            {heroCopy.stage.eyebrow}
          </div>
          <div className="rounded-full border border-[#16a34a]/25 bg-[#16a34a]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#86efac] light:text-[#166534]">
            {heroCopy.stage.status}
          </div>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-4 py-4 light:border-slate-200 light:bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.92))] sm:px-5 sm:py-6">
          <div className="mx-auto max-w-[16rem] text-center sm:max-w-[18rem]">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-white light:text-slate-900">
              {heroCopy.stage.title}
            </p>
            <p className="mt-2 hidden text-[13px] leading-[1.65] text-slate-400 light:text-slate-600 sm:block">
              {heroCopy.stage.description}
            </p>
          </div>

          <div className="relative mx-auto mt-5 aspect-[1.2/1] w-full max-w-[16rem] sm:mt-6 sm:aspect-[1.05/1] sm:max-w-[21rem]">
            <div className="absolute inset-x-[13%] top-[11%] h-[78%] rounded-[1.75rem] border border-white/6 bg-[linear-gradient(180deg,rgba(15,23,42,0.22),rgba(15,23,42,0.08))] light:border-slate-200/80 light:bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(248,250,252,0.78))]" />
            <div className="absolute inset-x-[25%] top-[17%] h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.28),transparent)]" />
            <div className="absolute inset-x-[25%] bottom-[17%] h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.24),transparent)]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
              {connectorPaths.map((path) => (
                <path
                  key={path}
                  d={path}
                  fill="none"
                  stroke="rgba(148,163,184,0.24)"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                />
              ))}
              <circle cx="50" cy="50" r="18" fill="rgba(22,163,74,0.05)" />
              <circle cx="50" cy="50" r="12.75" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="0.75" />
            </svg>

            {heroCopy.stage.modules.map((module, index) => {
              const position = modulePositions[index];
              const description = moduleDescriptions[index];
              if (!position || !description) return null;

              return (
                <div
                  key={module}
                  className={cn(
                    "absolute z-10 w-[6.15rem] -translate-x-1/2 -translate-y-1/2 rounded-[1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] px-2.5 py-2 shadow-[0_18px_32px_rgba(0,0,0,0.24)] backdrop-blur-[2px] light:border-slate-200 light:bg-white/88 sm:w-[8.6rem] sm:rounded-[1.1rem] sm:px-3.5 sm:py-3",
                    index === 1 && "text-right",
                    index === 3 && "text-right",
                  )}
                  style={position}
                >
                  <div className={cn("flex items-center gap-2", (index === 1 || index === 3) && "justify-end")}>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" aria-hidden />
                    <p className="text-[11px] font-semibold tracking-[-0.02em] text-white light:text-slate-900 sm:text-[13px]">
                      {module}
                    </p>
                  </div>
                  <p className="mt-1.5 hidden text-[11px] leading-[1.55] text-slate-400 light:text-slate-600 sm:block sm:text-[11.5px]">
                    {description}
                  </p>
                </div>
              );
            })}

            <div className="absolute left-1/2 top-1/2 z-20 w-[7rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] border border-[#16a34a]/20 bg-[linear-gradient(180deg,rgba(22,163,74,0.12),rgba(12,18,30,0.92))] px-3 py-3 text-center shadow-[0_22px_44px_rgba(0,0,0,0.34)] light:border-[#16a34a]/20 light:bg-[linear-gradient(180deg,rgba(240,253,244,0.96),rgba(255,255,255,0.94))] sm:w-[9.4rem] sm:rounded-[1.45rem] sm:px-5 sm:py-4">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[1rem] border border-[#16a34a]/20 bg-[#16a34a]/10 text-[#16a34a] light:bg-[#16a34a]/12 sm:h-10 sm:w-10 sm:rounded-2xl">
                <CoreMark className="h-[1.125rem] w-[1.125rem]" />
              </div>
              <p className="mt-2 text-[12px] font-semibold tracking-[-0.02em] text-white light:text-slate-900 sm:mt-3 sm:text-[14px]">
                Jedro sistema
              </p>
              <p className="mt-1 hidden text-[11px] leading-[1.55] text-slate-400 light:text-slate-600 sm:block sm:text-[11.5px]">
                Podatki, pravila in procesi tečejo skozi enoten model.
              </p>
            </div>

            <div className="absolute inset-x-[16%] bottom-[6%] hidden items-center justify-between gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-400 light:border-slate-200 light:bg-white/86 light:text-slate-600 sm:flex">
              <span>Podatki</span>
              <span className="h-px flex-1 bg-[linear-gradient(to_right,rgba(148,163,184,0.24),rgba(22,163,74,0.18),rgba(148,163,184,0.24))]" aria-hidden />
              <span>Pravila</span>
              <span className="h-px flex-1 bg-[linear-gradient(to_right,rgba(148,163,184,0.24),rgba(22,163,74,0.18),rgba(148,163,184,0.24))]" aria-hidden />
              <span>Tokovi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import CtaLink from "@/components/navbar/CtaLink";
import OfficeProductStage from "@/components/sections/office/OfficeProductStage";
import { bodyClass, kickerClass } from "@/design";
import { cn } from "@/lib/utils";

const proofLabels = [
  "Pregled",
  "Računi",
  "Skladišče",
  "Stranke",
  "PDF",
  "Excel",
] as const;

export default function JuTanOffice() {
  return (
    <Section
      id="office"
      belowFold
      labelledBy="office-title"
      className="scroll-mt-28 bg-[#020807] light:bg-slate-50"
      innerClassName="overflow-x-hidden"
      decorate={
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(22,163,74,0.1),transparent_26%),radial-gradient(circle_at_82%_24%,rgba(148,163,184,0.08),transparent_24%),linear-gradient(180deg,rgba(2,8,7,0.98),rgba(4,10,12,1))] light:bg-[radial-gradient(circle_at_16%_12%,rgba(22,163,74,0.08),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(148,163,184,0.07),transparent_28%),linear-gradient(180deg,#f8fafc,#f1f5f4)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.16),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(15,23,42,0.1),transparent)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.12),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(15,23,42,0.08),transparent)]"
            aria-hidden
          />
        </>
      }
    >
      <div className="pt-6 sm:pt-8 lg:pt-12">
        <div className="mx-auto grid w-full max-w-[1240px] gap-12 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.12fr)] xl:items-center xl:gap-14">
          <FadeIn>
            <div className="max-w-[36rem]">
              <p className={cn(kickerClass, "light:text-slate-500")}>IZDELEK JU-TAN</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h2
                  id="office-title"
                  className="text-[clamp(1.8rem,calc(1.35rem+1.9vw),2.85rem)] font-heading font-semibold leading-[1.08] tracking-[-0.05em] text-white light:text-slate-900"
                >
                  JU-TAN Office
                </h2>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 light:border-slate-200 light:bg-white/80 light:text-slate-600">
                  V AKTIVNEM RAZVOJU
                </span>
              </div>

              <p className="mt-5 max-w-[18ch] text-[clamp(1.55rem,calc(1.32rem+1.05vw),2.45rem)] font-heading font-semibold leading-[1.14] tracking-[-0.045em] text-white light:text-slate-900">
                Poslovna aplikacija, ki jo razvijamo sami.
              </p>

              <p className={`${bodyClass} mt-5 max-w-[35rem] text-slate-300 light:text-slate-600`}>
                JU-TAN Office je lastna namizna poslovna platforma JU-TAN v
                aktivnem razvoju. Združuje pregled poslovanja, račune, stranke in
                skladišče v enem okolju — in je konkreten primer naše programske
                izvedbe.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] tracking-[0.01em] text-white/74 light:text-slate-700">
                {proofLabels.map((label, index) => (
                  <span key={label} className="flex items-center gap-2">
                    {index > 0 ? (
                      <span className="text-slate-600 light:text-slate-400" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <span className="font-medium">{label}</span>
                  </span>
                ))}
              </div>

              <p className="mt-4 text-[12px] leading-[1.6] text-slate-500 light:text-slate-500">
                Prikazani podatki so demonstracijski.
              </p>

              <p className="mt-5 text-[12px] uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                Namizna aplikacija · Python · PySide6
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CtaLink
                  href="/ju-tan-office"
                  variant="secondary"
                  aria-label="Spoznajte JU-TAN Office"
                  className="border-white/14 bg-white/[0.03] text-white hover:border-[#16a34a]/26 hover:bg-white/[0.05] light:border-slate-200 light:bg-white light:text-slate-800 light:hover:border-[#16a34a]/35 light:hover:bg-[#f0fdf4]"
                >
                  Spoznajte JU-TAN Office
                </CtaLink>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <OfficeProductStage />
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

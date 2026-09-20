import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import CtaLink from "@/components/navbar/CtaLink";
import OfficeDownloadCta from "@/components/office-page/OfficeDownloadCta";
import OfficeInterface from "@/components/office-page/OfficeInterface";
import { bodyClass, kickerClass } from "@/design";
import { cn } from "@/lib/utils";

const businessFlow = [
  "Pregled",
  "Stranke",
  "Računi in ponudbe",
  "Skladišče",
  "PDF / Excel",
] as const;

const coreAreas = [
  {
    title: "Pregled",
    body: "Pregled ključnih poslovnih informacij in aktivnosti na enem mestu.",
  },
  {
    title: "Stranke",
    body: "Urejeni podatki o strankah in kontaktih v skupnem poslovnem okolju.",
  },
  {
    title: "Računi in ponudbe",
    body: "Priprava in pregled poslovnih dokumentov z možnostjo PDF izpisa.",
  },
  {
    title: "Skladišče",
    body: "Pregled artiklov, zaloge in osnovnih skladiščnih informacij.",
  },
] as const;

const engineeringSignals = [
  "Namizna aplikacija za Windows",
  "Python",
  "PySide6",
  "Lokalni podatkovni sloj",
  "PDF dokumenti",
  "Excel uvoz / izvoz",
] as const;

const sectionDecor = (
  <>
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(22,163,74,0.08),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(148,163,184,0.06),transparent_26%),linear-gradient(180deg,rgba(5,8,22,0.98),rgba(5,8,22,1))] light:bg-[radial-gradient(circle_at_16%_12%,rgba(22,163,74,0.07),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(148,163,184,0.06),transparent_28%),linear-gradient(180deg,#f8fafc,#f1f5f4)]"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.14),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(15,23,42,0.09),transparent)]"
      aria-hidden
    />
  </>
);

function ActiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300",
        "light:border-slate-200 light:bg-white/80 light:text-slate-600",
        className,
      )}
    >
      V AKTIVNEM RAZVOJU
    </span>
  );
}

export default function OfficePage() {
  return (
    <>
      {/* 1. Hero */}
      <Section
        labelledBy="office-page-title"
        className="scroll-mt-28 bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[46rem] pt-4 sm:pt-6 lg:pt-8">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>IZDELEK JU-TAN</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h1
                id="office-page-title"
                className="heading-hero font-heading font-semibold text-white light:text-slate-900"
              >
                JU-TAN Office
              </h1>
              <ActiveBadge />
            </div>

            <p className={`${bodyClass} mt-6 max-w-[38rem] text-slate-300 light:text-slate-600`}>
              Namizna poslovna aplikacija, ki jo razvijamo sami. Združuje pregled
              poslovanja, stranke, dokumente in skladišče v enem okolju — konkreten
              primer programske izvedbe JU-TAN.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <OfficeDownloadCta />
              <CtaLink href="#vmesnik" variant="secondary">
                Oglejte si vmesnik
              </CtaLink>
              <CtaLink href="/kontakt" variant="secondary">
                Pogovorimo se
              </CtaLink>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 2. Real interface proof */}
      <Section
        id="vmesnik"
        belowFold
        labelledBy="office-interface-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[68rem]">
          <FadeIn>
            <div className="mb-8 max-w-[36rem] md:mb-10">
              <h2
                id="office-interface-title"
                className="heading-display font-heading font-semibold text-white light:text-slate-900"
              >
                Resnični vmesnik
              </h2>
              <p className={`${bodyClass} mt-3.5 light:text-slate-600`}>
                Prikazani zasloni so iz dejanske aplikacije. Podatki so demonstracijski.
              </p>
            </div>
          </FadeIn>
          <OfficeInterface />
        </div>
      </Section>

      {/* 3. What Office connects */}
      <Section
        belowFold
        labelledBy="office-flow-title"
        className="bg-[#050816] light:bg-slate-50 lg:!pb-[4.25rem] xl:!pb-[4.5rem]"
      >
        <div className="mx-auto max-w-[52rem]">
          <FadeIn>
            <h2
              id="office-flow-title"
              className="heading-display font-heading font-semibold text-white light:text-slate-900"
            >
              Kaj povezuje
            </h2>
            <p className={`${bodyClass} mt-3.5 max-w-[40rem] light:text-slate-600`}>
              Eno okolje za pregled, stranke, račune in zalogo — brez ločenih orodij
              za vsak korak.
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            <ol className="mt-9 flex flex-col gap-3 border-y border-white/8 py-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-3 light:border-slate-200/80 md:py-8">
              {businessFlow.map((step, index) => (
                <li key={step} className="flex items-center gap-2 sm:gap-2.5">
                  {index > 0 ? (
                    <span
                      className="hidden text-slate-600 sm:inline light:text-slate-400"
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                  <span className="font-heading text-[1.05rem] font-semibold tracking-[-0.03em] text-white light:text-slate-900 md:text-[1.15rem]">
                    <span className="sm:hidden text-slate-500" aria-hidden>
                      {index > 0 ? "→ " : ""}
                    </span>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </Section>

      {/* 4. Core business areas */}
      <Section
        belowFold
        labelledBy="office-areas-title"
        className="bg-[#050816] light:bg-slate-50 lg:!py-[4.25rem] xl:!py-[4.5rem]"
      >
        <div className="mx-auto max-w-[58rem]">
          <FadeIn>
            <h2
              id="office-areas-title"
              className="heading-display font-heading font-semibold text-white light:text-slate-900"
            >
              Ključna poslovna področja
            </h2>
          </FadeIn>

          <ul className="mt-9 divide-y divide-white/8 border-y border-white/8 light:divide-slate-200/80 light:border-slate-200/80">
            {coreAreas.map((area, index) => (
              <li key={area.title}>
                <FadeIn delay={0.04 + index * 0.04}>
                  <div className="grid gap-2 py-7 sm:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)] sm:gap-8 md:py-8">
                    <h3 className="font-heading text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#16a34a]/90 light:text-[#15803d]">
                      {area.title}
                    </h3>
                    <p className={`${bodyClass} text-slate-400 light:text-slate-600`}>
                      {area.body}
                    </p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 5. Engineering */}
      <Section
        belowFold
        labelledBy="office-engineering-title"
        className="bg-[#050816] light:bg-slate-50 lg:!pt-[4.25rem] xl:!pt-[4.5rem]"
      >
        <div className="mx-auto max-w-[52rem]">
          <FadeIn>
            <h2
              id="office-engineering-title"
              className="heading-display font-heading font-semibold text-white light:text-slate-900"
            >
              Inženirska izvedba
            </h2>
            <p className={`${bodyClass} mt-3.5 max-w-[40rem] light:text-slate-600`}>
              JU-TAN Office ni predstavitveni koncept, temveč lasten programski
              izdelek, ki ga razvijamo in nadgrajujemo sami.
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/8 pt-5 light:border-slate-200/80 md:mt-6 md:pt-6">
              {engineeringSignals.map((signal) => (
                <li
                  key={signal}
                  className="text-[13px] tracking-[0.02em] text-slate-300 light:text-slate-700"
                >
                  <span className="mr-2 text-[#16a34a]/70" aria-hidden>
                    ·
                  </span>
                  {signal}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </Section>

      {/* 6. Active development */}
      <Section
        belowFold
        labelledBy="office-development-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[40rem]">
          <FadeIn>
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id="office-development-title"
                className="heading-display font-heading font-semibold text-white light:text-slate-900"
              >
                Aktivni razvoj
              </h2>
              <ActiveBadge />
            </div>
            <p className={`${bodyClass} mt-4 light:text-slate-600`}>
              JU-TAN Office se razvija naprej. Trenutno stanje pokažemo iskreno —
              z resničnim vmesnikom, ne s tržnimi obljubami.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* 7. Final CTA */}
      <Section
        belowFold
        labelledBy="office-cta-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[40rem] pb-4 sm:pb-6">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>NASLEDNJI KORAK</p>
            <h2
              id="office-cta-title"
              className="heading-display mt-3.5 font-heading font-semibold text-white light:text-slate-900"
            >
              Pogovorimo se o JU-TAN Office.
            </h2>
            <p className={`${bodyClass} mt-4 light:text-slate-600`}>
              Če vas zanima, kako bi se JU-TAN Office lahko vključil v vaše
              poslovno okolje, nam opišite svoje procese in potrebe.
            </p>
            <div className="mt-8">
              <CtaLink href="/kontakt" variant="primary">
                Pogovorimo se
              </CtaLink>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}

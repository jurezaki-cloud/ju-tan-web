import Link from "next/link";
import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import CtaLink from "@/components/navbar/CtaLink";
import { bodyClass, kickerClass, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";

const whenSituations = [
  {
    lead: "Obstoječa stran ne predstavlja več kakovosti podjetja",
    detail:
      "Vizualno in vsebinsko zaostaja za tem, kako podjetje dejansko deluje in komunicira.",
  },
  {
    lead: "Obiskovalec težko razume ponudbo ali naslednji korak",
    detail:
      "Informacije so razpršene, hierarhija je nejasna, CTA pa ni dovolj usmerjen.",
  },
  {
    lead: "Predloga omejuje strukturo, vsebino ali razvoj",
    detail:
      "Sistem ne omogoča potrebnih prilagoditev — ne danes, ne ob naslednji nadgradnji.",
  },
  {
    lead: "Potrebna je boljša uporabniška izkušnja",
    detail:
      "Navigacija, vsebina in vmesnik morajo obiskovalca voditi, ne zadrževati.",
  },
  {
    lead: "Stran mora delovati zanesljivo na različnih napravah",
    detail:
      "Odziven frontend je načrtovan namerno — ne kot naknadna prilagoditev.",
  },
  {
    lead: "Potrebne so integracije ali nadaljnje funkcionalne nadgradnje",
    detail:
      "Spletna rešitev mora ostati odprta za rast, povezave in nove zahteve.",
  },
] as const;

const uxPoints = [
  "razume, kaj podjetje ponuja",
  "najde relevantne informacije",
  "zaupa poslovanju",
  "ve, kaj storiti naprej",
  "uporablja vmesnik brez nepotrebnega trenja",
] as const;

const solutions = [
  {
    index: "01",
    title: "Poslovne spletne strani",
    body: "Jasna predstavitev podjetja, ponudbe in kontakta — z strukturo, ki podpira zaupanje in nadaljnji razvoj.",
  },
  {
    index: "02",
    title: "UI/UX in uporabniški vmesniki",
    body: "Načrtovanje tokov, hierarhije in interakcij, kjer je uporabniška izkušnja del poslovnega cilja.",
  },
  {
    index: "03",
    title: "Digitalne platforme",
    body: "Zahtevnejše digitalne izkušnje z več vsebinami, vlogami ali funkcionalnimi sklopi — brez nepotrebne kompleksnosti.",
  },
  {
    index: "04",
    title: "E-trgovine",
    body: "Spletna prodaja, kjer so struktura, vsebina in nakupni tok usklajeni s ponudbo podjetja.",
  },
  {
    index: "05",
    title: "Odziven frontend",
    body: "Implementacija, ki ohranja kakovost oblikovanja na različnih zaslonih in ostaja vzdržljiva v kodi.",
  },
] as const;

const designEngineering = [
  {
    title: "Oblikovanje in izvedba skupaj",
    body: "Odločitve o strukturi, interakciji in vizualni hierarhiji nastajajo z mislijo na frontend — ne šele po zaključku dizajna.",
  },
  {
    title: "Informacijska arhitektura vpliva na kodo",
    body: "Kako so vsebine razporejene in kako uporabnik napreduje, neposredno oblikuje komponente, poti in vzdržljivost sistema.",
  },
  {
    title: "Odzivnost je načrtovana",
    body: "Vedenje na mobilnih in namiznih zaslonih določimo namerno — ne kot naknadno stiskanje postavitve.",
  },
  {
    title: "Vzdržljiv frontend",
    body: "Koda mora ostati razumljiva, razširljiva in pripravljena na spremembe vsebine ter funkcionalnosti.",
  },
  {
    title: "Dostopnost in uporabnost",
    body: "Jasna navigacija, berljivost in predvidljivo vedenje vmesnika so del kakovosti — ne dodatek.",
  },
  {
    title: "Vizualna kakovost preživi implementacijo",
    body: "Dizajn ne sme izgubiti natančnosti v kodi. Frontend je del uporabniške izkušnje.",
  },
] as const;

const phases = [
  {
    number: "01",
    title: "Razumemo",
    description:
      "Poslovne cilje, obiskovalce, vsebino in zahteve — preden določimo strukturo ali tehnološki pristop.",
  },
  {
    number: "02",
    title: "Načrtujemo",
    description:
      "Informacijsko hierarhijo, uporabniške tokove, UX odločitve in tehnični okvir, ki jih bo rešitev morala podpirati.",
  },
  {
    number: "03",
    title: "Oblikujemo in razvijemo",
    description:
      "UI oblikovanje in frontend implementacija se razvijata skupaj — v preverljivih korakih do objavljene rešitve.",
  },
  {
    number: "04",
    title: "Razvijamo naprej",
    description:
      "Objava ni konec. Vzdrževanje, izboljšave UX in nove zahteve ostanejo del dolgoročnega razvoja.",
  },
] as const;

const afterLaunch = [
  {
    title: "Tehnično vzdrževanje",
    body: "Posodobitve, stabilnost in tehnična urejenost, da rešitev ostane zanesljiva.",
  },
  {
    title: "Razvoj vsebine",
    body: "Prilagoditve strukture in besedil, ko se ponudba ali komunikacija podjetja spremeni.",
  },
  {
    title: "UX izboljšave",
    body: "Nadaljnje izostritve tokov, hierarhije in jasnosti, kjer uporaba pokaže prostor za napredek.",
  },
  {
    title: "Funkcionalne nadgradnje",
    body: "Nove funkcije in povezave, ko poslovanje potrebuje več od osnovne spletne prisotnosti.",
  },
  {
    title: "Dolgoročno partnerstvo",
    body: "Lastništvo kode, brez nepotrebne vezave in vzdržljiva osnova za nadaljnji razvoj.",
  },
] as const;

const relatedLinks = [
  {
    label: "Razvoj programske opreme po meri",
    href: "/razvoj-programske-opreme",
  },
  { label: "JU-TAN Office", href: "/ju-tan-office" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

const sectionDecor = (
  <>
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_8%,rgba(22,163,74,0.07),transparent_32%),radial-gradient(ellipse_at_12%_88%,rgba(148,163,184,0.05),transparent_30%),linear-gradient(180deg,rgba(5,8,22,0.98),rgba(5,8,22,1))] light:bg-[radial-gradient(ellipse_at_72%_8%,rgba(22,163,74,0.06),transparent_34%),radial-gradient(ellipse_at_12%_88%,rgba(148,163,184,0.05),transparent_32%),linear-gradient(180deg,#f8fafc,#f1f5f4)]"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.14),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(15,23,42,0.09),transparent)]"
      aria-hidden
    />
  </>
);

export default function WebUiPage() {
  return (
    <>
      {/* 1. Hero */}
      <Section
        labelledBy="web-ui-hero-title"
        className="scroll-mt-28 bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[48rem] pt-4 sm:pt-6 lg:pt-8">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>
              <span
                className="inline-block h-px w-6 bg-[#16a34a]/70"
                aria-hidden
              />
              SPLETNE STRANI IN UI/UX
            </p>

            <h1
              id="web-ui-hero-title"
              className="heading-hero mt-5 font-heading font-semibold break-words text-white light:text-slate-900"
            >
              Spletne izkušnje, zgrajene za poslovanje — ne le za videz
            </h1>

            <p
              className={`${bodyClass} mt-6 max-w-[42rem] text-slate-300 light:text-slate-600`}
            >
              Za podjetja, ki potrebujejo profesionalno spletno prisotnost z
              jasno strukturo, uporabniško izkušnjo in tehnično izvedbo.
              Načrtujemo in gradimo spletne strani, digitalne izkušnje ter
              uporabniške vmesnike, kjer sta oblikovanje in frontend del iste
              rešitve — pripravljene na vzdrževanje in nadaljnji razvoj.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CtaLink href="/kontakt" variant="primary">
                Začnimo projekt
              </CtaLink>
              <CtaLink href="#proces" variant="secondary">
                Kako poteka izvedba
              </CtaLink>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 2. When / Who */}
      <Section
        belowFold
        labelledBy="web-ui-when-title"
        className="bg-[#050816] light:bg-slate-50"
      >
        <div className="mx-auto max-w-[56rem]">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>
              KDAJ IMA SMISEL
            </p>
            <h2
              id="web-ui-when-title"
              className="heading-display mt-3.5 max-w-[22ch] font-heading font-semibold text-white light:text-slate-900"
            >
              Ko spletna stran postane del poslovanja.
            </h2>
          </FadeIn>

          <ol className="mt-10 space-y-0 border-t border-white/10 light:border-slate-200">
            {whenSituations.map((item, index) => (
              <li
                key={item.lead}
                className="border-b border-white/10 light:border-slate-200"
              >
                <FadeIn delay={0.03 + index * 0.03}>
                  <div className="grid gap-3 py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-5 md:py-7">
                    <span className="pt-1 font-heading text-[12px] font-medium tabular-nums tracking-[0.16em] text-[#16a34a]/80 light:text-[#15803d]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 max-w-[40rem]">
                      <h3 className="font-heading text-[1.05rem] font-semibold tracking-[-0.03em] text-white light:text-slate-900 md:text-[1.15rem]">
                        {item.lead}
                      </h3>
                      <p
                        className={`${bodyClass} mt-2 text-[15px] text-slate-400 md:text-[16px] light:text-slate-600`}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 3. UI/UX in business terms */}
      <Section
        belowFold
        labelledBy="web-ui-ux-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:items-start">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>UI / UX</p>
            <h2
              id="web-ui-ux-title"
              className="heading-display mt-3.5 max-w-[16ch] font-heading font-semibold text-white light:text-slate-900"
            >
              Dober vmesnik uporabnika ne ustavlja.
            </h2>
            <p className={`${bodyClass} mt-5 max-w-[34rem] light:text-slate-600`}>
              UI/UX ni okras. Je način, kako spletna rešitev vodi obiskovalca —
              od prvega vtisa do jasnega naslednjega koraka.
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="border-l border-[#16a34a]/35 pl-6 light:border-[#16a34a]/40 sm:pl-8">
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-slate-500 light:text-slate-500">
                Obiskovalcu mora omogočiti, da
              </p>
              <ul className="mt-5 space-y-4">
                {uxPoints.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-[16px] leading-[1.55] tracking-[-0.014em] text-slate-200 light:text-slate-800 md:text-[17px]"
                  >
                    <span
                      className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#16a34a]"
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 4. What we build */}
      <Section
        belowFold
        labelledBy="web-ui-solutions-title"
        className="bg-[#050816] light:bg-slate-50"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>
              SPLETNE REŠITVE
            </p>
            <h2
              id="web-ui-solutions-title"
              className="heading-display mt-3.5 max-w-[36rem] font-heading font-semibold text-white light:text-slate-900"
            >
              Od predstavitve podjetja do zahtevnejše digitalne izkušnje.
            </h2>
          </FadeIn>

          <ol className="mt-10 border-t border-white/10 light:border-slate-200">
            {solutions.map((item) => (
              <li
                key={item.index}
                className="group grid gap-3 border-b border-white/10 py-6 transition-colors duration-hover ease-out hover:border-[#16a34a]/30 lg:grid-cols-[4.5rem_minmax(0,22rem)_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-4 lg:py-7 light:border-slate-200 light:hover:border-[#16a34a]/35"
              >
                <div className="pt-1 text-[12px] font-medium uppercase tracking-[0.2em] text-[#16a34a] light:text-[#15803d]">
                  {item.index}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[20px] font-semibold tracking-[-0.05em] text-white transition-colors duration-hover ease-out group-hover:text-[#f0fdf4] sm:text-[22px] md:text-[24px] light:text-slate-900 light:group-hover:text-slate-950">
                    {item.title}
                  </h3>
                </div>
                <div className="min-w-0">
                  <p className="max-w-[38rem] text-[15px] leading-[1.7] tracking-[-0.014em] text-slate-300 light:text-slate-700">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 5. Design + Engineering */}
      <Section
        belowFold
        labelledBy="web-ui-design-eng-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[56rem]">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>
              OBLIKOVANJE + INŽENIRING
            </p>
            <h2
              id="web-ui-design-eng-title"
              className="heading-display mt-3.5 max-w-[28ch] font-heading font-semibold text-white light:text-slate-900"
            >
              Kar načrtujemo, mora dobro delovati tudi v kodi.
            </h2>
            <p className={`${bodyClass} mt-5 max-w-[40rem] light:text-slate-600`}>
              Frontend ni samo izvedba dizajna. Je del uporabniške izkušnje in
              dolgoročne kakovosti produkta.
            </p>
          </FadeIn>

          <ul className="mt-10 divide-y divide-white/8 border-y border-white/8 light:divide-slate-200/80 light:border-slate-200/80">
            {designEngineering.map((item, index) => (
              <li key={item.title}>
                <FadeIn delay={0.03 + index * 0.03}>
                  <div className="grid gap-2 py-6 sm:grid-cols-[minmax(10rem,17rem)_minmax(0,1fr)] sm:gap-8 md:py-7">
                    <h3 className="font-heading text-[1.05rem] font-semibold tracking-[-0.03em] text-white light:text-slate-900 md:text-[1.12rem]">
                      {item.title}
                    </h3>
                    <p
                      className={`${bodyClass} text-[15px] text-slate-400 md:text-[16px] light:text-slate-600`}
                    >
                      {item.body}
                    </p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>

          <FadeIn delay={0.12}>
            <p className="mt-8 text-[13px] tracking-[0.04em] text-slate-500 light:text-slate-500">
              <span className="text-slate-400 light:text-slate-600">
                Next.js
              </span>
              <span className="mx-2.5 text-[#16a34a]/50" aria-hidden>
                ·
              </span>
              <span className="text-slate-400 light:text-slate-600">React</span>
              <span className="mx-2.5 text-[#16a34a]/50" aria-hidden>
                ·
              </span>
              <span className="text-slate-400 light:text-slate-600">
                Tailwind CSS
              </span>
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* 6. Process */}
      <Section
        id="proces"
        belowFold
        labelledBy="web-ui-process-title"
        className="scroll-mt-28 bg-[#050816] light:bg-slate-50"
        innerClassName="overflow-x-hidden"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
          <FadeIn className="lg:pt-1">
            <div className="max-w-[32rem]">
              <p className={cn(kickerClass, "light:text-slate-500")}>
                NAČIN DELA
              </p>
              <h2
                id="web-ui-process-title"
                className="heading-display mt-3.5 font-heading font-semibold break-words text-white light:text-slate-900"
              >
                Od cilja do objavljene rešitve.
              </h2>
              <p className={`${bodyClass} mt-4 max-w-[34rem] light:text-slate-600`}>
                Od poslovnega cilja do objave — in naprej, ko se zahteve
                razvijajo.
              </p>
            </div>
          </FadeIn>

          <ol className="border-y border-white/8 light:border-slate-200/80">
            {phases.map((phase, index) => (
              <li
                key={phase.number}
                className={cn(
                  "group transition-colors duration-300 motion-reduce:transition-none",
                  index > 0 &&
                    "border-t border-white/8 hover:border-white/14 light:border-slate-200/80 light:hover:border-slate-300/90",
                )}
              >
                <FadeIn delay={0.06 + index * 0.05}>
                  <div
                    className={cn(
                      "grid items-start gap-3.5 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5 md:gap-6 md:py-8 lg:py-[2.15rem]",
                      index === phases.length - 1 && "pb-9 md:pb-10 lg:pb-11",
                    )}
                  >
                    <p className="font-heading text-[1rem] font-semibold leading-none tabular-nums tracking-[0.12em] text-[#16a34a]/75 transition-colors duration-300 group-hover:text-[#16a34a]/90 motion-reduce:transition-none md:pt-0.5 md:text-[1.05rem]">
                      {phase.number}
                    </p>
                    <div className="min-w-0 max-w-[31rem]">
                      <h3 className="font-heading text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white light:text-slate-900 md:text-[1.45rem]">
                        {phase.title}
                      </h3>
                      <p
                        className={`${bodyClass} mt-2.5 max-w-[29rem] text-slate-400/92 light:text-slate-600`}
                      >
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 7. After launch */}
      <Section
        belowFold
        labelledBy="web-ui-after-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[52rem]">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>PO OBJAVI</p>
            <h2
              id="web-ui-after-title"
              className="heading-display mt-3.5 max-w-[24ch] font-heading font-semibold text-white light:text-slate-900"
            >
              Spletna rešitev se z objavo ne konča.
            </h2>
            <p className={`${bodyClass} mt-4 max-w-[40rem] light:text-slate-600`}>
              Po objavi ostane prostor za vzdrževanje, izboljšave in rast —
              z lastništvom kode in brez nepotrebne vezave.
            </p>
          </FadeIn>

          <ul className="mt-9 space-y-5">
            {afterLaunch.map((item, index) => (
              <li key={item.title}>
                <FadeIn delay={0.03 + index * 0.03}>
                  <div className="flex gap-4 sm:gap-5">
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16a34a]/80"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <h3 className="font-heading text-[1.05rem] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                        {item.title}
                      </h3>
                      <p
                        className={`${bodyClass} mt-1.5 text-[15px] text-slate-400 md:text-[16px] light:text-slate-600`}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 8. Related solutions */}
      <Section
        belowFold
        labelledBy="web-ui-related-title"
        className="bg-[#050816] light:bg-slate-50"
      >
        <div className="mx-auto max-w-[40rem]">
          <FadeIn>
            <h2
              id="web-ui-related-title"
              className="font-heading text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-slate-500 light:text-slate-500"
            >
              Povezane rešitve
            </h2>
            <ul className="mt-5 divide-y divide-white/8 border-y border-white/8 light:divide-slate-200/80 light:border-slate-200/80">
              {relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      textLinkClass,
                      "w-full justify-between py-3.5 text-[15px] no-underline hover:underline light:hover:text-slate-900",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </Section>

      {/* 9. Final CTA */}
      <Section
        belowFold
        labelledBy="web-ui-cta-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[40rem] pb-4 sm:pb-6 lg:pb-10">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>
              NASLEDNJI KORAK
            </p>
            <h2
              id="web-ui-cta-title"
              className="heading-display mt-3.5 font-heading font-semibold text-white light:text-slate-900"
            >
              Začnimo z vašim spletnim projektom.
            </h2>
            <p className={`${bodyClass} mt-4 light:text-slate-600`}>
              Opišite cilj, obiskovalce in kaj mora spletna rešitev omogočati.
              Skupaj preverimo obseg in pristop, ki ima za projekt največ
              smisla.
            </p>
            <div className="mt-8 pb-16 sm:pb-8">
              <CtaLink href="/kontakt" variant="primary">
                Pošljite povpraševanje
              </CtaLink>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import CtaLink from "@/components/navbar/CtaLink";
import {
  OFFICE_SHOT_H,
  OFFICE_SHOT_W,
  officeShots,
} from "@/components/office-page/officeAssets";
import { bodyClass, kickerClass, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";

const whenCustom = [
  {
    title: "Razdrobljeni ročni procesi",
    body: "Delo poteka v Excelu, e-pošti in ločenih dokumentih — brez enotnega sistema, ki bi sledil celotnemu procesu.",
  },
  {
    title: "Orodja, ki ne sledijo procesu",
    body: "Obstoječa programska oprema pokriva del potreb, a zahteva izogibanja, podvojevanje podatkov ali ročne korake.",
  },
  {
    title: "Sistemi, ki morajo izmenjevati podatke",
    body: "Poslovanje teče čez več orodij, a podatki ne tečejo zanesljivo med njimi.",
  },
  {
    title: "Potreba po razširljivem sistemu",
    body: "Potrebujete rešitev, ki jo je mogoče vzdrževati, razširiti in razvijati naprej — brez začetka od nič ob vsaki spremembi.",
  },
] as const;

const systems = [
  {
    index: "01",
    title: "Poslovne aplikacije",
    body: "Aplikacije, zasnovane okoli konkretnih poslovnih procesov in vlog v podjetju.",
  },
  {
    index: "02",
    title: "Spletne aplikacije",
    body: "Spletni sistemi za interno uporabo, partnerje ali stranke — z jasnimi tokovi in vzdržljivo arhitekturo.",
  },
  {
    index: "03",
    title: "Namizne aplikacije",
    body: "Namizne rešitve, kjer je lokalno okolje, zmogljivost ali delovni tok bolj primeren od spleta.",
  },
  {
    index: "04",
    title: "Interna orodja",
    body: "Orodja za ekipe, ki skrajšajo ponavljajoče se delo in uredijo notranje procese.",
  },
  {
    index: "05",
    title: "Integracije in API",
    body: "Povezave med sistemi, izmenjava podatkov in API, ki omogoča nadaljnji razvoj.",
  },
  {
    index: "06",
    title: "Avtomatizacija in podatkovni tokovi",
    body: "Avtomatizacija korakov in podatkovnih tokov tam, kjer zanesljivost prinese dejansko korist.",
  },
  {
    index: "07",
    title: "AI, kjer je smiselno",
    body: "Vključitev umetne inteligence le tam, kjer podpre proces — ne kot samostojen cilj.",
  },
  {
    index: "08",
    title: "Modernizacija in razširitve",
    body: "Nadgradnja, razširitev ali postopna modernizacija obstoječih sistemov, kjer je to smiselno.",
  },
] as const;

const approach = [
  {
    title: "Razumemo poslovni proces",
    body: "Najprej razjasnimo, kako delo poteka danes, kje nastajajo ovire in kaj mora sistem dejansko podpreti.",
  },
  {
    title: "Arhitektura pred nepotrebno kompleksnostjo",
    body: "Izberemo strukturo, ki rešuje zahteve — brez tehnologije zaradi tehnologije.",
  },
  {
    title: "Razvoj v preverljivih korakih",
    body: "Gradimo po korakih, ki jih je mogoče pregledati, preveriti in usmeriti naprej.",
  },
  {
    title: "Vzdržljivost in modularna rast",
    body: "Koda in moduli morajo ostati razumljivi, da jih je mogoče vzdrževati in razširjati.",
  },
  {
    title: "Lastništvo kode",
    body: "Projekt in dokumentacija ostaneta jasno v lasti naročnika.",
  },
  {
    title: "Brez nepotrebne vezave",
    body: "Arhitektura ne temelji na odvisnosti od enega ponudnika, kjer to ni potrebno.",
  },
  {
    title: "Dolgoročni razvoj in podpora",
    body: "Po prvi različici ostanemo partner pri vzdrževanju, nadgradnjah in nadaljnjem razvoju.",
  },
] as const;

const phases = [
  {
    number: "01",
    title: "Razumemo",
    description:
      "Poslovni proces, uporabnike, podatke in omejitve okolja — preden predlagamo arhitekturo.",
  },
  {
    number: "02",
    title: "Načrtujemo",
    description:
      "Zahteve, strukturo sistema, vmesnike in povezave, ki jih bo programska oprema morala podpirati.",
  },
  {
    number: "03",
    title: "Razvijemo",
    description:
      "Izvedba po preverljivih korakih: delujoči deli sistema, pregledi in uskladitev z zahtevami.",
  },
  {
    number: "04",
    title: "Razvijamo naprej",
    description:
      "Vzdrževanje, nadgradnje in nadaljnji razvoj, ko se poslovanje in zahteve spreminjajo.",
  },
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

export default function SoftwareDevPage() {
  const dashboard = officeShots.dashboard;

  return (
    <>
      {/* 1. Hero */}
      <Section
        labelledBy="software-dev-hero-title"
        className="scroll-mt-28 bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[46rem] pt-4 sm:pt-6 lg:pt-8">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>
              PROGRAMSKA OPREMA PO MERI
            </p>

            <h1
              id="software-dev-hero-title"
              className="heading-hero mt-5 font-heading font-semibold break-words text-white light:text-slate-900"
            >
              Razvoj programske opreme za resnične poslovne zahteve
            </h1>

            <p
              className={`${bodyClass} mt-6 max-w-[40rem] text-slate-300 light:text-slate-600`}
            >
              Za podjetja, kjer standardna orodja ne pokrijejo procesov dovolj
              dobro. Načrtujemo in zgradimo programsko opremo po meri — spletne
              in namizne aplikacije, interna orodja, integracije in sisteme, ki
              jih je mogoče vzdrževati in razvijati naprej.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CtaLink href="/kontakt" variant="primary">
                Začnimo projekt
              </CtaLink>
              <CtaLink href="#primer" variant="secondary">
                Oglejte si primer
              </CtaLink>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 2. When custom software makes sense */}
      <Section
        belowFold
        labelledBy="software-dev-when-title"
        className="bg-[#050816] light:bg-slate-50"
      >
        <div className="mx-auto max-w-[52rem]">
          <FadeIn>
            <h2
              id="software-dev-when-title"
              className="heading-display font-heading font-semibold text-white light:text-slate-900"
            >
              Kdaj ima smisel programska oprema po meri
            </h2>
            <p className={`${bodyClass} mt-3.5 max-w-[40rem] light:text-slate-600`}>
              Po meri ima smisel, ko standardna orodja ne sledijo dovolj dobro
              temu, kako podjetje dejansko dela.
            </p>
          </FadeIn>

          <ul className="mt-9 divide-y divide-white/8 border-y border-white/8 light:divide-slate-200/80 light:border-slate-200/80">
            {whenCustom.map((item, index) => (
              <li key={item.title}>
                <FadeIn delay={0.04 + index * 0.04}>
                  <div className="grid gap-2 py-7 sm:grid-cols-[minmax(10rem,16rem)_minmax(0,1fr)] sm:gap-8 md:py-8">
                    <h3 className="font-heading text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#16a34a]/90 light:text-[#15803d]">
                      {item.title}
                    </h3>
                    <p className={`${bodyClass} text-slate-400 light:text-slate-600`}>
                      {item.body}
                    </p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 3. What we develop */}
      <Section
        belowFold
        labelledBy="software-dev-systems-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <FadeIn>
            <h2
              id="software-dev-systems-title"
              className="heading-display max-w-[40rem] font-heading font-semibold text-white light:text-slate-900"
            >
              Kakšne sisteme razvijamo
            </h2>
            <p className={`${bodyClass} mt-3.5 max-w-[42rem] light:text-slate-600`}>
              Gradimo programske sisteme okoli poslovnih zahtev — ne prodajamo
              zaključenega ERP paketa.
            </p>
          </FadeIn>

          <ol className="mt-10 border-t border-white/10 light:border-slate-200">
            {systems.map((item) => (
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

      {/* 4. Engineering approach */}
      <Section
        belowFold
        labelledBy="software-dev-approach-title"
        className="bg-[#050816] light:bg-slate-50"
      >
        <div className="mx-auto max-w-[52rem]">
          <FadeIn>
            <h2
              id="software-dev-approach-title"
              className="heading-display font-heading font-semibold text-white light:text-slate-900"
            >
              Inženirski pristop
            </h2>
            <p className={`${bodyClass} mt-3.5 max-w-[40rem] light:text-slate-600`}>
              Programska oprema mora biti razumljiva, vzdržljiva in pripravljena
              na rast — ne le objavljena.
            </p>
          </FadeIn>

          <ul className="mt-9 divide-y divide-white/8 border-y border-white/8 light:divide-slate-200/80 light:border-slate-200/80">
            {approach.map((item, index) => (
              <li key={item.title}>
                <FadeIn delay={0.04 + index * 0.03}>
                  <div className="grid gap-2 py-6 sm:grid-cols-[minmax(10rem,18rem)_minmax(0,1fr)] sm:gap-8 md:py-7">
                    <h3 className="font-heading text-[1.05rem] font-semibold tracking-[-0.03em] text-white light:text-slate-900 md:text-[1.15rem]">
                      {item.title}
                    </h3>
                    <p className={`${bodyClass} text-slate-400 light:text-slate-600`}>
                      {item.body}
                    </p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 5. Real engineering proof */}
      <Section
        id="primer"
        belowFold
        labelledBy="software-dev-proof-title"
        className="scroll-mt-28 bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[68rem]">
          <FadeIn>
            <div className="mb-8 max-w-[40rem] md:mb-10">
              <h2
                id="software-dev-proof-title"
                className="heading-display font-heading font-semibold text-white light:text-slate-900"
              >
                Primer lastnega razvoja: JU-TAN Office
              </h2>
              <p className={`${bodyClass} mt-3.5 light:text-slate-600`}>
                JU-TAN Office je lastna namizna poslovna aplikacija JU-TAN za
                Windows — razvita v Pythonu in PySide6. Modularna je in vključuje
                področja, kot so stranke, računi, ponudbe in skladišče, ter
                podporo za PDF dokumente in Excel uvoz/izvoz. Aplikacija je v
                aktivnem razvoju. Prikazani podatki so demonstracijski.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <figure
              className={cn(
                "overflow-hidden rounded-[1.05rem] border border-white/12 bg-[#0a1012]",
                "shadow-[0_22px_48px_rgba(0,0,0,0.34)]",
                "light:border-slate-200/90 light:bg-white light:shadow-[0_18px_40px_rgba(15,23,42,0.1)]",
              )}
            >
              <div className="relative aspect-[16/10] w-full sm:aspect-[16/9.5]">
                <Image
                  src={dashboard.src}
                  alt={dashboard.alt}
                  width={OFFICE_SHOT_W}
                  height={OFFICE_SHOT_H}
                  sizes="(min-width: 1280px) 980px, (min-width: 768px) 90vw, 100vw"
                  className="h-full w-full object-cover object-[center_12%]"
                />
              </div>
              <figcaption className="sr-only">{dashboard.label}</figcaption>
            </figure>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-7">
              <Link
                href="/ju-tan-office"
                className={cn(textLinkClass, "light:hover:text-slate-900")}
              >
                Spoznajte JU-TAN Office
              </Link>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 6. Development process */}
      <Section
        belowFold
        labelledBy="software-dev-process-title"
        className="bg-[#050816] light:bg-slate-50"
        innerClassName="overflow-x-hidden"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start lg:gap-14">
          <FadeIn className="lg:pt-1">
            <div className="max-w-[34rem]">
              <h2
                id="software-dev-process-title"
                className="heading-display font-heading font-semibold break-words text-white light:text-slate-900"
              >
                Kako poteka razvoj
              </h2>
              <p className={`${bodyClass} mt-3.5 max-w-[38rem] light:text-slate-600`}>
                Od razumevanja zahtev do nadaljnjega razvoja — v jasnih,
                preverljivih korakih.
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

      {/* 7. Final CTA */}
      <Section
        belowFold
        labelledBy="software-dev-cta-title"
        className="bg-[#050816] light:bg-slate-50"
        decorate={sectionDecor}
      >
        <div className="mx-auto max-w-[40rem] pb-4 sm:pb-6 lg:pb-10">
          <FadeIn>
            <p className={cn(kickerClass, "light:text-slate-500")}>
              NASLEDNJI KORAK
            </p>
            <h2
              id="software-dev-cta-title"
              className="heading-display mt-3.5 font-heading font-semibold text-white light:text-slate-900"
            >
              Začnimo z vašim projektom.
            </h2>
            <p className={`${bodyClass} mt-4 light:text-slate-600`}>
              Opišite programsko opremo, sistem ali poslovni proces, ki ga želite
              izboljšati. Skupaj preverimo, kaj ima smisel zgraditi.
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

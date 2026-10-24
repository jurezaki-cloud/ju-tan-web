import Link from "next/link";
import Section from "@/components/common/Section";
import SeoFaq from "@/components/common/SeoFaq";
import CtaLink from "@/components/navbar/CtaLink";
import { bodyClass, kickerClass, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";

const inquiryHref = "/kontakt?storitev=Videoprodukcija";

const services = [
  [
    "Profesionalna videoprodukcija",
    "Video načrtujemo glede na namen, kanal in dolžino. Od koncepta do izvoza, pripravljenega za objavo.",
  ],
  [
    "Promocijski videi",
    "Predstavitev podjetja, storitve ali ponudbe z jasnim sporočilom in usklajeno grafično podobo.",
  ],
  [
    "Reels in družbena omrežja",
    "Kratke vertikalne vsebine za objave, kjer mora biti sporočilo razumljivo v prvih sekundah.",
  ],
  [
    "Video oglasi",
    "Jedrnate oglasne različice za kampanje, prilagojene formatu kanala.",
  ],
  [
    "Predstavitve izdelkov in podjetij",
    "Mirnejši predstavitveni video za spletno stran, ponudbo ali poslovni nastop.",
  ],
  [
    "AI podpora produkciji",
    "Umetno inteligenco uporabimo tam, kjer pospeši pripravo, različice ali montažo. Končni video ostane usklajen z znamko.",
  ],
] as const;

const formats = [
  {
    label: "Promocija",
    title: "Film o podjetju",
    text: "Daljša predstavitev, ki poveže obraz, ponudbo in razlog za stik.",
  },
  {
    label: "Kratka oblika",
    title: "Reels in izrezki",
    text: "Vertikalne vsebine, ki jih je mogoče objaviti brez dodatnega preoblikovanja.",
  },
  {
    label: "Oglas",
    title: "Video za kampanjo",
    text: "Kratka različica z enim jasnim pozivom k dejanju.",
  },
  {
    label: "Izdelek",
    title: "Predstavitev ponudbe",
    text: "Prikaz izdelka, storitve ali programa v kontekstu, v katerem ga stranka uporablja.",
  },
] as const;

const steps = [
  ["Brief", "Namen, občinstvo, kanal in to, kar mora gledalec po ogledu storiti."],
  ["Koncept", "Struktura sporočila, ton in vizualna smer, usklajena z znamko."],
  ["Gradivo", "Snemanje ali ureditev obstoječega gradiva, ki ga imate pri roki."],
  ["Montaža", "Rez, ritem, napisi in grafični elementi v enem izgledu."],
  ["Izvoz", "Datoteke v formatih za splet, družbena omrežja ali oglas."],
] as const;

export const videoFaq = [
  {
    question: "Ali izdelujete promocijske videe za podjetja?",
    answer:
      "Da. JU-TAN Studio pripravi promocijski video od koncepta do izvoza za spletno stran, ponudbo ali družbena omrežja.",
  },
  {
    question: "Ali pripravite tudi kratke vsebine, Reels in video oglase?",
    answer:
      "Da. Poleg daljše predstavitve pripravimo kratke vertikalne vsebine in oglasne različice, prilagojene kanalu objave.",
  },
  {
    question: "Ali pri videu uporabljate umetno inteligenco?",
    answer:
      "Kjer je smiselno, AI orodja pospešijo pripravo, različice ali montažo. Končni video uskladimo z vašo znamko in sporočilom, ne pa z naključnim slogom orodja.",
  },
  {
    question: "Ali lahko video povežete z logotipom in spletno stranjo?",
    answer:
      "Da. Videoprodukcija je v istem studiu kot grafično oblikovanje in izdelava spletnih strani, zato lahko podoba, splet in video nastopajo usklajeno.",
  },
  {
    question: "Za katera podjetja delate videoprodukcijo?",
    answer:
      "Sedež imamo v Cerknici. Videoprodukcijo izvajamo za podjetja na Notranjskem in drugod po Sloveniji.",
  },
  {
    question: "Kako začnemo?",
    answer:
      "Pošljite povpraševanje in na kratko opišite, kje bo video objavljen ter kaj mora gledalec po ogledu narediti. Nato uskladimo obseg in naslednji korak.",
  },
] as const;

const related = [
  {
    href: "/graficno-oblikovanje",
    kicker: "Grafika",
    title: "Logotip in celostna podoba",
    text: "Video dobi isto barvo, tipografijo in znak, kot ju podjetje uporablja drugje.",
  },
  {
    href: "/spletne-strani-in-ui-ux",
    kicker: "Splet",
    title: "Spletne strani",
    text: "Promocijski video lahko postane del spletne predstavitve, ne ločena priloga.",
  },
  {
    href: "/reference",
    kicker: "Delo",
    title: "Reference",
    text: "Oglejte si spletne projekte, portal in poslovni program JU-TAN Office.",
  },
] as const;

export default function VideoPage() {
  return (
    <>
      <Section labelledBy="video-page-title" className="overflow-hidden bg-[#050816] light:bg-slate-50">
        <div className="relative mx-auto max-w-6xl pt-4 sm:pt-8">
          <nav aria-label="Drobtinice">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-400 light:text-slate-600">
              <li>
                <Link href="/" className={textLinkClass}>
                  Domov
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-200 light:text-slate-800" aria-current="page">
                Videoprodukcija
              </li>
            </ol>
          </nav>

          <p className={cn(kickerClass, "mt-8")}>JU-TAN STUDIO · CERKNICA</p>
          <h1
            id="video-page-title"
            className="heading-hero mt-5 max-w-4xl font-heading font-semibold text-white light:text-slate-900"
          >
            Video, ki podjetje poveže s stranko.
          </h1>
          <p className={cn(bodyClass, "mt-6 max-w-3xl text-lg leading-8 text-slate-300 light:text-slate-600")}>
            Profesionalna videoprodukcija za promocijske filme, Reels, oglase in
            predstavitve izdelkov. Iz Cerknice za podjetja na Notranjskem in po
            Sloveniji.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <CtaLink href={inquiryHref} className="w-full sm:w-auto">
              Zahtevajte ponudbo za video
            </CtaLink>
            <CtaLink href="#formati" variant="secondary" className="w-full sm:w-auto">
              Oglejte si formate
            </CtaLink>
          </div>
        </div>
      </Section>

      <Section id="formati" labelledBy="video-formats" className="bg-[#050816] light:bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <p className={kickerClass}>FORMATI</p>
          <h2
            id="video-formats"
            className="heading-display mt-4 max-w-3xl font-heading font-semibold text-white light:text-slate-900"
          >
            Vrste videov, ki jih pripravljamo.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400 light:text-slate-600">
            Spodnji prikazi opisujejo formate produkcije. Ne predstavljajo
            posameznih naročnikov ali rezultatov kampanj.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {formats.map((item, index) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] light:border-slate-200 light:bg-white"
              >
                <div
                  className="relative flex aspect-video items-end overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(22,163,74,0.35),transparent_42%),linear-gradient(160deg,#0b1220,#050816)] p-5 light:border-slate-200 light:bg-[radial-gradient(circle_at_20%_20%,rgba(22,163,74,0.2),transparent_42%),linear-gradient(160deg,#f8fafc,#e2e8f0)]"
                  aria-hidden="true"
                >
                  <div className="absolute inset-x-6 top-6 flex gap-1.5">
                    <span className="h-8 flex-1 rounded-md bg-white/10 light:bg-slate-900/10" />
                    <span className="h-8 w-16 rounded-md bg-emerald-400/25" />
                  </div>
                  <div className="absolute inset-x-6 bottom-14 h-2 rounded-full bg-white/10 light:bg-slate-900/10" />
                  <p className="relative text-[10px] font-semibold tracking-[0.22em] text-emerald-300 light:text-emerald-700">
                    0{index + 1} · {item.label}
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-white light:text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section id="storitve" labelledBy="video-services" className="bg-[#050816] light:bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <p className={kickerClass}>STORITVE</p>
          <h2
            id="video-services"
            className="heading-display mt-4 max-w-3xl font-heading font-semibold text-white light:text-slate-900"
          >
            Od promocijskega filma do kratke objave.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map(([title, text], index) => (
              <article
                key={title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 light:border-slate-200 light:bg-white"
              >
                <span className="text-xs font-semibold text-[#16a34a]">0{index + 1}</span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-white light:text-slate-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section labelledBy="video-process" className="bg-[#050816] light:bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <p className={kickerClass}>POTEK</p>
          <h2
            id="video-process"
            className="heading-display mt-4 max-w-3xl font-heading font-semibold text-white light:text-slate-900"
          >
            Produkcija v petih preverljivih korakih.
          </h2>
          <ol className="mt-10 divide-y divide-white/10 border-y border-white/10 light:divide-slate-200 light:border-slate-200">
            {steps.map(([title, text], index) => (
              <li key={title} className="grid gap-2 py-6 sm:grid-cols-[4rem_minmax(0,14rem)_minmax(0,1fr)] sm:gap-6">
                <span className="text-sm font-semibold text-[#16a34a]">0{index + 1}</span>
                <h3 className="font-heading text-xl font-semibold text-white light:text-slate-900">
                  {title}
                </h3>
                <p className="text-sm leading-6 text-slate-400 light:text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section labelledBy="video-local" className="bg-[#050816] light:bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className={kickerClass}>IZ CERKNICE</p>
            <h2
              id="video-local"
              className="heading-display mt-4 font-heading font-semibold text-white light:text-slate-900"
            >
              Izdelava promocijskih videov za podjetja v Sloveniji.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-slate-400 light:text-slate-600">
            <p>
              JU-TAN Studio v Cerknici združuje videoprodukcijo z grafičnim
              oblikovanjem in izdelavo spletnih strani. Podjetje tako dobi
              usklajen nastop, ne ločenih izvajalcev za znak, splet in film.
            </p>
            <p>
              Delamo za naročnike na Notranjskem in drugod po Sloveniji. Obseg
              prilagodimo kanalu: spletna predstavitev, družbena omrežja ali
              krajši oglas.
            </p>
          </div>
        </div>
      </Section>

      <SeoFaq
        id="videoprodukcija-faq"
        title="Pogosta vprašanja o videoprodukciji"
        items={videoFaq}
      />

      <Section labelledBy="video-related" className="bg-[#050816] light:bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <p className={kickerClass}>POVEZANE REŠITVE</p>
          <h2
            id="video-related"
            className="heading-display mt-4 max-w-3xl font-heading font-semibold text-white light:text-slate-900"
          >
            Video je močnejši, ko stoji ob podobi in spletu.
          </h2>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 motion-reduce:transition-none light:border-slate-200 light:bg-white"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {item.kicker}
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-white light:text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">
                  {item.text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Section labelledBy="video-cta" className="bg-[#050816] light:bg-slate-50">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-7 sm:p-10">
          <p className={kickerClass}>NASLEDNJI KORAK</p>
          <h2
            id="video-cta"
            className="heading-display mt-4 font-heading font-semibold text-white light:text-slate-900"
          >
            Opišite video, ki ga potrebujete.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300 light:text-slate-600">
            Povejte, kje bo objavljen in kaj mora gledalec po ogledu storiti.
            Odgovorimo s predlogom obsega, ne s predlogo, ki ne ustreza vaši znamki.
          </p>
          <div className="mt-7">
            <CtaLink href={inquiryHref}>Pošljite povpraševanje</CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/common/Section";
import SeoFaq from "@/components/common/SeoFaq";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
  serviceAreas,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const path = "/graficno-oblikovanje";
const pageTitle = "Grafično oblikovanje Cerknica – logotipi in CGP";
const pageDescription =
  "JU-TAN Studio iz Cerknice: izdelava logotipov, celostne grafične podobe, letaki, vizitke in digitalni dizajn za podjetja na Notranjskem in po Sloveniji.";

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path,
});

const portfolio = [
  {
    kind: "LOGOTIP",
    title: "Znak, ki ostane v spominu",
    text: "Čist koncept, premišljena tipografija in različice za svetlo, temno ter enobarvno uporabo.",
    mark: "JT",
  },
  {
    kind: "CELOSTNA PODOBA",
    title: "Enoten obraz podjetja",
    text: "Barvni sistem, tipografija in vizualna pravila, ki držijo skupaj splet, tisk in poslovne materiale.",
    mark: "Aa",
  },
  {
    kind: "PROMOCIJA",
    title: "Materiali z jasnim sporočilom",
    text: "Letaki, oglasi in grafike z močno hierarhijo, pripravljeni za hitro uporabo v kampanji.",
    mark: "→",
  },
] as const;

const services = [
  [
    "Logotipi",
    "Prepoznaven znak in tipografski sistem, pripravljen za splet, tisk in družbena omrežja.",
  ],
  [
    "Celostna grafična podoba",
    "Barve, tipografija, pravila uporabe in vizualni jezik, ki podjetje poveže v prepoznavno celoto.",
  ],
  [
    "Letaki in promocijski materiali",
    "Jasne, prodajno usmerjene kompozicije za tiskane in digitalne kampanje.",
  ],
  [
    "Vizitke in poslovne predloge",
    "Usklajeni dokumenti, predstavitve in materiali za profesionalen vsakodnevni nastop.",
  ],
  [
    "Digitalni dizajn",
    "Grafike za splet, družbena omrežja, oglase, pasice in druge digitalne formate.",
  ],
  [
    "Priprava za tisk",
    "Pravilni formati, dimenzije in izvoz datotek za zanesljivo izvedbo pri tiskarju.",
  ],
] as const;

const faq = [
  {
    question: "Ali nudite grafično oblikovanje v Cerknici in po Sloveniji?",
    answer:
      "JU-TAN Studio ima sedež v Cerknici. Izdelavo logotipov, celostnih grafičnih podob in promocijskih materialov izvajamo za podjetja na Notranjskem in po Sloveniji.",
  },
  {
    question: "Kako poteka izdelava logotipa?",
    answer:
      "Najprej spoznamo podjetje, njegovo ponudbo in ciljne stranke. Nato določimo vizualno smer, oblikujemo znak in tipografijo ter pripravimo dogovorjene različice za splet in tisk.",
  },
  {
    question: "Ali izdelujete logotipe za nova podjetja?",
    answer:
      "Da. JU-TAN Creative pripravi logotip in vizualno smer za novo podjetje ali blagovno znamko ter uporabne različice za splet in tisk.",
  },
  {
    question: "Kaj vključuje celostna grafična podoba?",
    answer:
      "Obseg prilagodimo projektu. Celostna podoba lahko vključuje logotip, barvni sistem, tipografijo, osnovna pravila uporabe ter predloge za poslovne in promocijske materiale.",
  },
  {
    question: "Ali oblikujete letake, vizitke in promocijske materiale?",
    answer:
      "Da. Oblikujemo letake, vizitke, oglase, poslovne predloge, predstavitve in druge tiskane ali digitalne promocijske materiale.",
  },
  {
    question: "Ali pripravite datoteke za tisk?",
    answer:
      "Da. Končne materiale lahko pripravimo v ustreznih formatih in dimenzijah za predajo tiskarju ter ločeno za digitalno uporabo.",
  },
  {
    question: "Ali lahko osvežite obstoječi logotip ali grafično podobo?",
    answer:
      "Da. Obstoječo identiteto lahko vizualno osvežimo in poenotimo, pri tem pa po potrebi ohranimo prepoznavne elemente znamke.",
  },
] as const;

export default function GraphicDesignPage() {
  const origin = siteConfig.url.replace(/\/$/, "");
  const pageUrl = absoluteUrl(path);
  const breadcrumbId = "breadcrumb-graphic-design";
  const serviceId = `${origin}/graficno-oblikovanje#service`;

  return (
    <>
      <Header />
      <main id="main" className="pt-24">
        <Section
          labelledBy="graphics-title"
          className="overflow-hidden bg-[#050816] light:bg-slate-50"
        >
          <div className="relative mx-auto max-w-6xl py-8 sm:py-14">
            <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
              JU-TAN CREATIVE STUDIO
            </p>
            <h1
              id="graphics-title"
              className="heading-hero mt-5 max-w-4xl font-heading font-semibold text-white light:text-slate-900"
            >
              Grafično oblikovanje v Cerknici za vaše podjetje.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 light:text-slate-600">
              Profesionalna in hitra izdelava logotipov, celostnih grafičnih
              podob, letakov, vizitk, predlog in digitalnih dizajnov. Od prve
              ideje do datotek, pripravljenih za splet ali tisk.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/kontakt"
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Želim grafično rešitev
              </Link>
              <Link
                href="/izdelava-logotipa"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/50 light:border-slate-300 light:text-slate-900"
              >
                Izdelava logotipa
              </Link>
            </div>
            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              {[
                "LOGOTIP · IDENTITETA",
                "TISK · PROMOCIJA",
                "DIGITAL · DESIGN",
              ].map((x) => (
                <div
                  key={x}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center text-xs font-semibold tracking-[0.18em] text-emerald-400 light:border-slate-200 light:bg-white"
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
        </Section>
        <Section
          labelledBy="graphics-portfolio"
          className="bg-[#050816] light:bg-slate-50"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
              VIZUALNI SISTEM
            </p>
            <h2
              id="graphics-portfolio"
              className="heading-display mt-4 max-w-3xl font-heading font-semibold text-white light:text-slate-900"
            >
              Dizajn, ki ni samo lep. Je prepoznaven.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-400 light:text-slate-600">
              Vsak projekt gradimo kot uporaben sistem. Spodnji prikazi
              predstavljajo vrste rešitev, ki jih JU-TAN Creative pripravlja za
              blagovne znamke.
            </p>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {portfolio.map((item, i) => (
                <article
                  key={item.kind}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] light:border-slate-200 light:bg-white"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-emerald-500/20 via-cyan-500/5 to-[#050816] light:border-slate-200">
                    <div className="absolute h-44 w-44 rounded-full border border-emerald-400/20 transition duration-500 group-hover:scale-110" />
                    <div className="absolute h-28 w-28 rotate-45 rounded-3xl border border-white/10 transition duration-500 group-hover:rotate-[55deg]" />
                    <span className="relative font-heading text-5xl font-semibold tracking-[-0.08em] text-white light:text-slate-900">
                      {item.mark}
                    </span>
                    <span className="absolute left-5 top-5 text-[10px] font-semibold tracking-[0.22em] text-emerald-400">
                      0{i + 1} · {item.kind}
                    </span>
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
        <Section
          id="storitve"
          labelledBy="graphics-services"
          className="bg-[#050816] light:bg-slate-50"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
              VSE NA ENEM MESTU
            </p>
            <h2
              id="graphics-services"
              className="heading-display mt-4 max-w-3xl font-heading font-semibold text-white light:text-slate-900"
            >
              Od ideje do prepoznavne vizualne podobe.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map(([title, text], i) => (
                <article
                  key={title}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-500/40 light:border-slate-200 light:bg-white"
                >
                  <span className="text-xs font-semibold text-emerald-400">
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-semibold text-white light:text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Section>
        <Section
          labelledBy="graphics-seo"
          className="bg-[#050816] light:bg-slate-50"
        >
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
                GRAFIČNO OBLIKOVANJE JU-TAN
              </p>
              <h2
                id="graphics-seo"
                className="heading-display mt-4 font-heading font-semibold text-white light:text-slate-900"
              >
                Izdelava logotipa in celostna grafična podoba.
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-slate-400 light:text-slate-600">
              <p>
                JU-TAN Studio iz Cerknice za podjetja na Notranjskem in po
                Sloveniji združuje izdelavo logotipov, celostnih grafičnih podob
                in oblikovanje materialov za tisk ter digitalne kanale. Tako
                lahko podjetje dobi usklajen vizualni nastop brez sestavljanja
                različnih izvajalcev.
              </p>
              <p>
                Pri oblikovanju iščemo ravnotežje med prepoznavnostjo,
                preglednostjo in praktično uporabo. Končni dizajn mora delovati
                na spletni strani, dokumentu, vizitki, letaku, oglasu in drugih
                formatih, kjer se vaša znamka sreča s stranko.
              </p>
            </div>
          </div>
        </Section>
        <SeoFaq
          id="graficno-oblikovanje-faq"
          title="Pogosta vprašanja o grafičnem oblikovanju"
          items={faq}
        />
        <Section
          labelledBy="graphics-next"
          className="bg-[#050816] light:bg-slate-50"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
              POVEZANE REŠITVE
            </p>
            <h2
              id="graphics-next"
              className="heading-display mt-4 max-w-3xl font-heading font-semibold text-white light:text-slate-900"
            >
              Ko grafična podoba postane del celotne digitalne zgodbe.
            </h2>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              <Link
                href="/spletne-strani-in-ui-ux"
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-500/40 light:border-slate-200 light:bg-white"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Splet
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-white light:text-slate-900">
                  Spletne strani & UI/UX
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">
                  Novo identiteto prenesemo v sodobno spletno izkušnjo,
                  prilagojeno telefonu in računalniku.
                </p>
                <span className="mt-5 inline-block text-sm font-semibold text-emerald-400">
                  Poglejte rešitev →
                </span>
              </Link>
              <Link
                href="/razvoj-programske-opreme"
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-500/40 light:border-slate-200 light:bg-white"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Razvoj
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-white light:text-slate-900">
                  Programske rešitve
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">
                  Vizualni sistem lahko nadaljujemo v uporabniške vmesnike in
                  poslovne rešitve po meri.
                </p>
                <span className="mt-5 inline-block text-sm font-semibold text-emerald-400">
                  Poglejte razvoj →
                </span>
              </Link>
              <Link
                href="/reference"
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-500/40 light:border-slate-200 light:bg-white"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Delo
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-white light:text-slate-900">
                  Reference JU-TAN
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">
                  Oglejte si spletne projekte, portale, JU-TAN Office in druge
                  rešitve našega studia.
                </p>
                <span className="mt-5 inline-block text-sm font-semibold text-emerald-400">
                  Oglejte si reference →
                </span>
              </Link>
            </div>
          </div>
        </Section>
        <Section
          labelledBy="graphics-process"
          className="bg-[#050816] light:bg-slate-50"
        >
          <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              HITRO · UREJENO · PROFESIONALNO
            </p>
            <h2
              id="graphics-process"
              className="heading-display mt-4 font-heading font-semibold text-white light:text-slate-900"
            >
              Povejte, kaj potrebujete. Mi oblikujemo vizualno rešitev.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300 light:text-slate-600">
              Pripravimo smer, oblikujemo rešitev in jo predamo v uporabnih
              formatih. Za nov logotip, osvežitev podobe ali posamezen
              promocijski material.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/kontakt"
                className="inline-flex rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Pošljite povpraševanje
              </Link>
              <span className="text-sm text-slate-400 light:text-slate-600">
                Logotip · CGP · letak · vizitka · digitalni dizajn
              </span>
            </div>
          </div>
        </Section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbJsonLd(
                [
                  { name: "Domov", path: "/" },
                  { name: "Grafično oblikovanje", path },
                ],
                breadcrumbId,
              ),
              {
                "@type": "WebPage",
                "@id": `${origin}/graficno-oblikovanje#webpage`,
                url: pageUrl,
                name: pageTitle,
                description: pageDescription,
                inLanguage: "sl",
                isPartOf: { "@id": `${origin}/#website` },
                about: { "@id": serviceId },
                breadcrumb: { "@id": `${origin}/#${breadcrumbId}` },
              },
              {
                "@type": "Service",
                "@id": serviceId,
                name: "Grafično oblikovanje, logotipi in celostne podobe",
                description: pageDescription,
                provider: { "@id": `${origin}/#organization` },
                url: pageUrl,
                areaServed: serviceAreas,
              },
            ],
          }),
        }}
      />
      <Footer />
    </>
  );
}

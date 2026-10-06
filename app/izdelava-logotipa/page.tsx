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
} from "@/lib/seo";

const path = "/izdelava-logotipa";
const title = "Izdelava logotipa in celostne grafične podobe";
const description =
  "JU-TAN Studio iz Cerknice oblikuje logotipe in celostne grafične podobe za podjetja po Sloveniji. Od zasnove do uporabnih datotek za splet in tisk.";
export const metadata = createPageMetadata({ title, description, path });
const faq = [
  {
    question: "Kaj potrebujete za pripravo logotipa?",
    answer:
      "Ime podjetja ali znamke, opis dejavnosti, ciljno občinstvo in primere vizualnih smeri, ki so vam blizu. Če podobo že imate, nam pošljite tudi obstoječe materiale.",
  },
  {
    question: "Kaj dobim ob predaji?",
    answer:
      "Obseg predaje določimo v ponudbi. Dogovor lahko vključuje vektorske datoteke, različice za splet in tisk, barvne ter enobarvne različice in osnovna pravila uporabe.",
  },
  {
    question: "Koliko stane izdelava logotipa in koliko časa traja?",
    answer:
      "Cena in rok sta odvisna od obsega, števila dogovorjenih smeri, usklajevanj in spremljajočih materialov. Po uvodnem pogovoru pripravimo ponudbo z obsegom in predvidenim rokom.",
  },
  {
    question: "Ali lahko osvežite obstoječi logotip?",
    answer:
      "Da. Pregledamo obstoječo podobo in določimo, katere prepoznavne elemente ohraniti ter kaj prilagoditi za jasnejšo uporabo na spletu in v tisku.",
  },
];
export default function LogoPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-24">
        <Section
          labelledBy="logo-title"
          className="bg-[#050816] light:bg-slate-50"
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
              JU-TAN CREATIVE · CERKNICA
            </p>
            <h1
              id="logo-title"
              className="heading-hero mt-5 font-heading font-semibold"
            >
              Profesionalna izdelava logotipa in celostne grafične podobe
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 light:text-slate-600">
              Vaš logotip mora biti prepoznaven in uporaben: na spletni strani,
              vizitki, računu ali oglasu. JU-TAN Studio iz Cerknice oblikuje
              vizualne identitete za nova in obstoječa podjetja na Notranjskem
              in po Sloveniji.
            </p>
            <Link
              href="/kontakt"
              className="mt-8 inline-block rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white"
            >
              Pošljite povpraševanje za logotip
            </Link>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                [
                  "Logotip",
                  "Znak, tipografija in usklajene različice za dogovorjene načine uporabe.",
                ],
                [
                  "Celostna grafična podoba",
                  "Barve, tipografski sistem in pravila, ki povežejo vse materiale vaše znamke.",
                ],
                [
                  "Splet in tisk",
                  "Vizitke, letaki, poslovne predloge in digitalne grafike kot nadaljevanje identitete.",
                ],
              ].map(([heading, text]) => (
                <section
                  key={heading}
                  className="rounded-3xl border border-white/10 p-6 light:border-slate-200 light:bg-white"
                >
                  <h2 className="font-heading text-xl font-semibold">
                    {heading}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">
                    {text}
                  </p>
                </section>
              ))}
            </div>
            <section className="mt-14">
              <h2 className="heading-display font-heading font-semibold">
                Od pogovora do datotek za uporabo
              </h2>
              <ol className="mt-7 grid gap-5 md:grid-cols-2">
                {[
                  [
                    "Spoznamo podjetje",
                    "Opredelimo dejavnost, občinstvo, značaj znamke in mesta, kjer boste logotip uporabljali.",
                  ],
                  [
                    "Določimo obseg",
                    "Dogovorimo se o vizualnih smereh, usklajevanjih, končnih formatih, ceni in roku.",
                  ],
                  [
                    "Oblikujemo in uskladimo",
                    "Razvijemo dogovorjeno zasnovo ter jo prilagodimo povratnim informacijam in praktični uporabi.",
                  ],
                  [
                    "Predamo identiteto",
                    "Pripravimo dogovorjene datoteke in različice. Po potrebi podobo nadaljujemo v poslovne materiale ali spletno stran.",
                  ],
                ].map(([heading, text], i) => (
                  <li
                    key={heading}
                    className="rounded-3xl bg-white/[0.035] p-6 light:bg-white"
                  >
                    <span className="text-sm text-emerald-500">0{i + 1}</span>
                    <h3 className="mt-3 text-xl font-semibold">{heading}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400 light:text-slate-600">
                      {text}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
            <section className="mt-12 rounded-3xl border border-emerald-500/20 p-7">
              <h2 className="font-heading text-2xl font-semibold">
                Kaj vključiti v povpraševanje?
              </h2>
              <p className="mt-4 leading-7 text-slate-400 light:text-slate-600">
                Napišite ime znamke, dejavnost in kaj potrebujete: samo logotip,
                celostno podobo ali tudi vizitke, letake in spletno stran.
                Dodajte želeni rok ter obstoječi logotip, če načrtujete
                osvežitev.
              </p>
              <div className="mt-6 flex flex-wrap gap-5">
                <Link
                  href="/graficno-oblikovanje"
                  className="font-semibold text-emerald-500"
                >
                  Vse grafične storitve →
                </Link>
                <Link
                  href="/reference"
                  className="font-semibold text-emerald-500"
                >
                  Projekti JU-TAN →
                </Link>
              </div>
            </section>
          </div>
        </Section>
        <SeoFaq
          id="logo-faq"
          title="Pogosta vprašanja o izdelavi logotipa"
          items={faq}
        />
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
                  {
                    name: "Grafično oblikovanje",
                    path: "/graficno-oblikovanje",
                  },
                  { name: "Izdelava logotipa", path },
                ],
                "breadcrumb-logo",
              ),
              {
                "@type": "WebPage",
                "@id": `${absoluteUrl(path)}#webpage`,
                url: absoluteUrl(path),
                name: title,
                description,
                inLanguage: "sl",
                isPartOf: { "@id": absoluteUrl("/#website") },
                breadcrumb: { "@id": absoluteUrl("/#breadcrumb-logo") },
                about: { "@id": `${absoluteUrl(path)}#service` },
              },
              {
                "@type": "Service",
                "@id": `${absoluteUrl(path)}#service`,
                name: title,
                description,
                url: absoluteUrl(path),
                provider: { "@id": absoluteUrl("/#organization") },
                areaServed: { "@type": "Country", name: "Slovenia" },
              },
            ],
          }),
        }}
      />
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import SoftwareDevPage from "@/components/software-dev-page/SoftwareDevPage";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
  serviceAreas,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const path = "/razvoj-programske-opreme";
const pageTitle = "Razvoj programske opreme po meri za podjetja | JU-TAN";
const pageDescription =
  "Razvoj poslovne programske opreme po meri: spletne in namizne aplikacije, CRM, integracije ter avtomatizacija procesov za podjetja po Sloveniji.";

const baseMetadata = createPageMetadata({
  title: "Razvoj programske opreme po meri",
  description: pageDescription,
  path,
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: { absolute: pageTitle },
  openGraph: {
    ...baseMetadata.openGraph,
    title: pageTitle,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: pageTitle,
  },
};

export default function RazvojProgramskeOpremePage() {
  const origin = siteConfig.url.replace(/\/$/, "");
  const pageUrl = absoluteUrl(path);
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const webpageId = `${origin}/razvoj-programske-opreme#webpage`;
  const serviceId = `${origin}/razvoj-programske-opreme#service`;
  const breadcrumbId = "breadcrumb-software-dev";

  return (
    <>
      <Header />
      <main id="main">
        <SoftwareDevPage />
        <section aria-labelledby="poslovna-programska-oprema" className="bg-[#050816] px-6 py-16 text-white light:bg-slate-50 light:text-slate-900">
          <div className="mx-auto max-w-5xl">
            <h2 id="poslovna-programska-oprema" className="font-heading text-3xl font-semibold">Razvoj poslovne programske opreme po meri</h2>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300 light:text-slate-700">Razvoj poslovne programske opreme prilagodimo konkretnim procesom podjetja: od vodenja strank, ponudb in naročil do zalog, dokumentov ter notranjih delovnih tokov. Pred implementacijo preverimo obstoječa orodja, podatke in možnosti integracij, da rešitev ne podvaja že opravljenega dela.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div><h3 className="font-semibold">CRM in poslovni sistemi</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Upravljanje strank, ponudb, dokumentov in poslovnih opravil.</p></div>
              <div><h3 className="font-semibold">Avtomatizacija in integracije</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Povezovanje podatkov, zmanjšanje ročnega dela in prilagoditev procesom.</p></div>
              <div><h3 className="font-semibold">Spletne in namizne aplikacije</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Razvoj orodij z možnostjo vzdrževanja in nadaljnjih nadgradenj.</p></div>
            </div>
            <section aria-labelledby="primeri-uporabe" className="mt-12">
              <h2 id="primeri-uporabe" className="font-heading text-2xl font-semibold">Kdaj podjetje potrebuje programsko opremo po meri?</h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300 light:text-slate-700">Razvoj po meri je smiseln, kadar obstoječa orodja ne sledijo delovnemu procesu ali zahtevajo večkratno ročno vnašanje istih podatkov. Najprej preverimo potrebe, obstoječe sisteme in možnosti povezovanja, šele nato predlagamo rešitev.</p>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200"><h3 className="font-semibold">Ponudbe, naročila in računi</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Povezovanje dokumentov in podatkov o strankah v enoten delovni tok.</p></li>
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200"><h3 className="font-semibold">Zaloga in nabava</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Bolj pregleden pregled artiklov, dobaviteljev in zalog.</p></li>
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200"><h3 className="font-semibold">CRM in delo s strankami</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Zgodovina sodelovanja, naloge in ključne informacije na enem mestu.</p></li>
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200"><h3 className="font-semibold">Povezovanje sistemov</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Manj podvajanja podatkov med orodji, kjer so integracije tehnično izvedljive.</p></li>
              </ul>
            </section>
            <section aria-labelledby="implementacija-programske-opreme" className="mt-12">
              <h2 id="implementacija-programske-opreme" className="font-heading text-2xl font-semibold">Kako poteka implementacija poslovne programske opreme?</h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300 light:text-slate-700">Implementacija ni samo namestitev programa. Pomembno je, da rešitev ustreza dejanskemu delu ekipe, da so podatki urejeni in da uporabniki razumejo nov način dela. Pri vsakem projektu določimo obseg glede na obstoječe procese in tehnične možnosti.</p>
              <ol className="mt-6 grid gap-4 md:grid-cols-2">
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200"><h3 className="font-semibold">1. Analiza procesov</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Pregledamo naloge, uporabnike, podatke in težave, ki jih želimo odpraviti.</p></li>
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200"><h3 className="font-semibold">2. Načrt rešitve</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Opredelimo funkcije, potrebne povezave, način uvajanja in merila uspeha.</p></li>
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200"><h3 className="font-semibold">3. Razvoj in preizkus</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Funkcionalnosti preverimo na dogovorjenih primerih uporabe pred uvedbo.</p></li>
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200"><h3 className="font-semibold">4. Uvedba in izboljšave</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Načrtujemo prehod, podporo uporabnikom in nadaljnje nadgradnje po potrebi.</p></li>
              </ol>
              <div className="mt-8 rounded-2xl border border-white/10 p-5 light:border-slate-200">
                <h3 className="font-semibold">Implementacija za veleprodajna in druga poslovna okolja</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 light:text-slate-700">V veleprodaji je smiselno najprej preveriti, kako so povezani naročila, zaloga, dobavitelji, računi in obstoječi poslovni programi. Nato ocenimo, ali je primernejša integracija že uporabljenih orodij, prilagoditev posameznega koraka ali razvoj nove aplikacije. Možnosti in obseg določi analiza podatkov ter razpoložljivih vmesnikov.</p>
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 light:text-slate-700">Za manjša podjetja je lahko primernejša prilagoditev obstoječega orodja kot razvoj novega. Če potrebujete povezavo med več sistemi, pred odločitvijo preverimo razpoložljive vmesnike in omejitve.</p>
            </section>
            <p className="mt-8 max-w-3xl leading-7 text-slate-300 light:text-slate-700">Oglejte si <Link href="/ju-tan-office" className="font-semibold underline underline-offset-4">JU-TAN Office</Link>, preverite <Link href="/reference" className="font-semibold underline underline-offset-4">reference</Link> ali pošljite <Link href="/kontakt?service=software" className="font-semibold underline underline-offset-4">povpraševanje za razvoj po meri</Link>.</p>
          </div>
        </section>
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
                  { name: "Razvoj programske opreme", path },
                ],
                breadcrumbId,
              ),
              {
                "@type": "WebPage",
                "@id": webpageId,
                url: pageUrl,
                name: pageTitle,
                description: pageDescription,
                inLanguage: "sl",
                isPartOf: { "@id": websiteId },
                about: { "@id": serviceId },
                breadcrumb: { "@id": `${origin}/#${breadcrumbId}` },
              },
              {
                "@type": "Service",
                "@id": serviceId,
                name: "Razvoj programske opreme po meri",
                description: pageDescription,
                provider: { "@id": organizationId },
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

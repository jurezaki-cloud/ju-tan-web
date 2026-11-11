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
            <h2 id="poslovna-programska-oprema" className="font-heading text-3xl font-semibold">
              Kaj pridobi vaše podjetje s programsko opremo po meri?
            </h2>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300 light:text-slate-700">
              Ko ekipa iste podatke prepisuje med tabelami, e-pošto in različnimi programi,
              izgublja čas in težje spremlja delo. Najprej preverimo obstoječe rešitve,
              nato predlagamo prilagoditev, povezavo sistemov ali razvoj po meri — glede
              na dejanske potrebe in tehnične možnosti.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 p-5 light:border-slate-200">
                <h3 className="font-semibold">Manj podvajanja podatkov</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">
                  Povezan potek od stranke in ponudbe do naročila ali računa zmanjša potrebo po ročnem prepisovanju.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 p-5 light:border-slate-200">
                <h3 className="font-semibold">Preglednejše delo ekipe</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">
                  Jasni statusi, odgovornosti in podatki na enem mestu olajšajo spremljanje odprtih nalog.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 p-5 light:border-slate-200">
                <h3 className="font-semibold">Rešitev, ki lahko raste</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">
                  Funkcije in integracije načrtujemo tako, da jih je mogoče po potrebi preverljivo nadgrajevati.
                </p>
              </div>
            </div>
            <div className="mt-10">
              <h3 className="font-heading text-xl font-semibold">
                Primeri uporabe v proizvodnji in veleprodaji
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-slate-300 light:text-slate-700">
                V manjšem proizvodnem podjetju lahko interna aplikacija poveže naročila
                z delovnimi nalogi ter omogoči spremljanje njihovega napredka in porabe
                materiala. V veleprodaji lahko integracija poveže naročila z zalogo in
                računovodskim programom, da zaposleni podatke vnesejo samo enkrat.
                Pred izvedbo preverimo obstoječe programe, kakovost podatkov in
                razpoložljive vmesnike.
              </p>
            </div>
            <nav aria-label="Povezane storitve, reference in kontakt" className="mt-10">
              <h3 className="font-heading text-xl font-semibold">Oglejte si ustrezno rešitev</h3>
              <p className="mt-3 max-w-3xl leading-7 text-slate-300 light:text-slate-700">
                Za račune, ponudbe in stranke spoznajte{" "}
                <Link href="/ju-tan-office" className="font-semibold underline underline-offset-4">poslovni program JU-TAN Office</Link>.
                Za spletne portale preverite{" "}
                <Link href="/spletne-strani-in-ui-ux" className="font-semibold underline underline-offset-4">izdelavo spletnih strani in aplikacij</Link>.
                Preglejte{" "}
                <Link href="/reference" className="font-semibold underline underline-offset-4">reference naših projektov</Link>{" "}
                ali pošljite{" "}
                <Link href="/kontakt?service=software" className="font-semibold underline underline-offset-4">povpraševanje za razvoj programske opreme po meri</Link>.
              </p>
            </nav>
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

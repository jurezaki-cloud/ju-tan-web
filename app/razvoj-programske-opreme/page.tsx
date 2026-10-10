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
const pageTitle = "Programska oprema po meri – Slovenija | JU-TAN";
const pageDescription =
  "Razvoj programske opreme po meri za podjetja v Sloveniji: poslovne, spletne in namizne aplikacije, interna orodja, integracije, avtomatizacija in dolgoročna podpora.";

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
            <h2 id="poslovna-programska-oprema" className="font-heading text-3xl font-semibold">Poslovna programska oprema po meri za slovenska podjetja</h2>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300 light:text-slate-700">Razvijamo poslovne aplikacije za mala in srednja podjetja, ki potrebujejo boljši pregled nad strankami, ponudbami, naročili, zalogami in delovnimi procesi. Rešitve prilagodimo potrebam podjetja in jih po potrebi povežemo z obstoječimi sistemi.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div><h3 className="font-semibold">CRM in poslovni sistemi</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Upravljanje strank, ponudb, dokumentov in poslovnih opravil.</p></div>
              <div><h3 className="font-semibold">Avtomatizacija in integracije</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Povezovanje podatkov, zmanjšanje ročnega dela in prilagoditev procesom.</p></div>
              <div><h3 className="font-semibold">Spletne in namizne aplikacije</h3><p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">Razvoj orodij z možnostjo vzdrževanja in nadaljnjih nadgradenj.</p></div>
            </div>
            <p className="mt-8 max-w-3xl leading-7 text-slate-300 light:text-slate-700">Oglejte si <Link href="/ju-tan-office" className="font-semibold underline underline-offset-4">JU-TAN Office</Link>, preverite <Link href="/reference" className="font-semibold underline underline-offset-4">reference</Link> ali pošljite <Link href="/kontakt" className="font-semibold underline underline-offset-4">povpraševanje za razvoj po meri</Link>.</p>
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

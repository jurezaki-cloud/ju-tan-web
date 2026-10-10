import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import References from "@/components/sections/References";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { projectStudies } from "@/lib/data/project-studies";

const path = "/reference";
const pageTitle =
  "Reference | Spletne strani, grafično oblikovanje in poslovna programska oprema";
const pageDescription =
  "Izbrani projekti JU-TAN Studio: spletne strani, portali, grafično oblikovanje, logotipi, celostne podobe in poslovni program JU-TAN Office.";

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path,
});

export default function ReferencePage() {
  const origin = siteConfig.url.replace(/\/$/, "");
  const breadcrumbId = "breadcrumb-references";
  return (
    <>
      <Header />
      <main id="main" className="pt-24">
        <References full />
        <section aria-labelledby="reference-services-title" className="bg-[#050816] px-6 py-12 text-white light:bg-slate-50 light:text-slate-900">
          <div className="mx-auto max-w-5xl">
            <h2 id="reference-services-title" className="font-heading text-2xl font-semibold">Katere storitve stojijo za našimi projekti?</h2>
            <p className="mt-3 max-w-3xl text-slate-300 light:text-slate-700">Oglejte si, kako povezujemo spletni razvoj, oblikovanje in poslovno programsko opremo. Vsak projekt prilagodimo ciljem in uporabnikom.</p>
            <nav aria-label="Storitve JU-TAN" className="mt-6 flex flex-wrap gap-4">
              <Link href="/spletne-strani-in-ui-ux" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">Izdelava spletnih strani in portalov</Link>
              <Link href="/graficno-oblikovanje" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">Grafično oblikovanje</Link>
              <Link href="/razvoj-programske-opreme" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">Razvoj programske opreme</Link>
              <Link href="/kontakt" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">Povpraševanje</Link>
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
                  { name: "Reference", path },
                ],
                breadcrumbId,
              ),
              {
                "@type": "CollectionPage",
                "@id": `${origin}/reference#webpage`,
                url: absoluteUrl(path),
                name: pageTitle,
                description: pageDescription,
                inLanguage: "sl",
                isPartOf: { "@id": `${origin}/#website` },
                about: { "@id": `${origin}/#organization` },
                breadcrumb: { "@id": `${origin}/#${breadcrumbId}` },
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: projectStudies.map((project, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: project.name,
                    url: absoluteUrl(`/reference/${project.slug}`),
                  })),
                },
              },
            ],
          }),
        }}
      />
      <Footer />
    </>
  );
}

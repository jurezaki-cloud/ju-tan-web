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
              <Link href="/videoprodukcija" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">Videoprodukcija</Link>
              <Link href="/razvoj-programske-opreme" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">Razvoj programske opreme</Link>
              <Link href="/kontakt" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">Povpraševanje</Link>
            </nav>
          </div>
        </section>
        <section aria-labelledby="reference-cta-title" className="bg-[#050816] px-6 pb-20 text-white light:bg-slate-50 light:text-slate-900">
          <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-500/25 bg-emerald-500/10 px-6 py-10 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 light:text-emerald-700">Od ideje do izvedbe</p>
            <h2 id="reference-cta-title" className="mt-3 font-heading text-3xl font-semibold">Imate podoben projekt v mislih?</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300 light:text-slate-700">
              Potrebujete spletno stran, uporabniški portal, prepoznavno grafično podobo, promocijski video ali poslovno programsko opremo?
              Opišite nam svoj cilj in skupaj bomo določili primeren naslednji korak.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link href="/kontakt" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 font-semibold text-slate-950 transition hover:bg-emerald-400">
                Pošljite povpraševanje →
              </Link>
              <Link href="/spletne-strani-in-ui-ux" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">
                Oglejte si naše storitve
              </Link>
            </div>
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

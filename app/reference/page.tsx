import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import References from "@/components/sections/References";
import { absoluteUrl, breadcrumbJsonLd, createPageMetadata, serializeJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const path = "/reference";
const pageTitle = "Reference | Spletne strani, grafično oblikovanje in poslovna programska oprema";
const pageDescription = "Izbrani projekti JU-TAN Studio: spletne strani, portali, grafično oblikovanje, logotipi, celostne podobe in poslovni program JU-TAN Office.";

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
      <main id="main" className="pt-24"><References full /></main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org",
        "@graph": [
          breadcrumbJsonLd([{ name: "Domov", path: "/" }, { name: "Reference", path }], breadcrumbId),
          { "@type": "CollectionPage", "@id": `${origin}/reference#webpage`, url: absoluteUrl(path), name: pageTitle, description: pageDescription, inLanguage: "sl", isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#organization` }, breadcrumb: { "@id": `${origin}/#${breadcrumbId}` } },
        ],
      }) }} />
      <Footer />
    </>
  );
}

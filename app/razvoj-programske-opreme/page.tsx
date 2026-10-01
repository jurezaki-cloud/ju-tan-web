import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SoftwareDevPage from "@/components/software-dev-page/SoftwareDevPage";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const path = "/razvoj-programske-opreme";
const pageTitle = "Razvoj programske opreme po meri za podjetja | JU-TAN";
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
                areaServed: {
                  "@type": "Country",
                  name: "Slovenia",
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

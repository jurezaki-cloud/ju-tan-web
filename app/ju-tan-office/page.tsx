import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OfficePage from "@/components/office-page/OfficePage";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const path = "/ju-tan-office";
const pageTitle = "JU-TAN Office | Namizna poslovna aplikacija";
const pageDescription =
  "JU-TAN Office je lastna namizna poslovna aplikacija JU-TAN. Pregled, stranke, računi in skladišče v enem okolju — v aktivnem razvoju.";

const baseMetadata = createPageMetadata({
  title: "JU-TAN Office",
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

export default function JuTanOfficeProductPage() {
  const origin = siteConfig.url.replace(/\/$/, "");
  const pageUrl = absoluteUrl(path);
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const webpageId = `${origin}/ju-tan-office#webpage`;
  const softwareId = `${origin}/ju-tan-office#software`;
  const breadcrumbId = "breadcrumb-office";

  return (
    <>
      <Header />
      <main id="main">
        <OfficePage />
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
                  { name: "JU-TAN Office", path },
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
                about: { "@id": softwareId },
                breadcrumb: { "@id": `${origin}/#${breadcrumbId}` },
              },
              {
                "@type": "SoftwareApplication",
                "@id": softwareId,
                name: "JU-TAN Office",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Windows",
                description: pageDescription,
                inLanguage: "sl",
                author: { "@id": organizationId },
                provider: { "@id": organizationId },
                url: pageUrl,
              },
            ],
          }),
        }}
      />
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WebUiPage from "@/components/web-ui-page/WebUiPage";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
  serviceAreas,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const path = "/spletne-strani-in-ui-ux";
const pageTitle = "Izdelava spletnih strani – Cerknica in Slovenija | JU-TAN";
const pageDescription =
  "Izdelava spletnih strani za podjetja po meri. JU-TAN Studio iz Cerknice načrtuje odzivne spletne strani, UI/UX in spletne trgovine. Pošljite povpraševanje.";

const baseMetadata = createPageMetadata({
  title: "Spletne strani in UI/UX",
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

export default function SpletneStraniInUiUxPage() {
  const origin = siteConfig.url.replace(/\/$/, "");
  const pageUrl = absoluteUrl(path);
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const webpageId = `${origin}/spletne-strani-in-ui-ux#webpage`;
  const serviceId = `${origin}/spletne-strani-in-ui-ux#service`;
  const breadcrumbId = "breadcrumb-web-ui";

  return (
    <>
      <Header />
      <main id="main">
        <WebUiPage />
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
                  { name: "Spletne strani in UI/UX", path },
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
                name: "Izdelava spletnih strani za podjetja in UI/UX",
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

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VideoPage from "@/components/video-page/VideoPage";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const videoOffers = [
  "Profesionalna videoprodukcija",
  "Promocijski videi",
  "Reels in kratke vsebine za družbena omrežja",
  "Video oglasi",
  "Predstavitve izdelkov in podjetij",
  "AI podpora videoprodukciji",
] as const;

const path = "/videoprodukcija";
const pageTitle = "Videoprodukcija | Promocijski videi, Reels in oglasi | JU-TAN";
const pageDescription =
  "Profesionalna videoprodukcija JU-TAN Studio iz Cerknice: promocijski videi, Reels, video oglasi in predstavitve podjetij v Sloveniji, tudi s podporo AI.";

const baseMetadata = createPageMetadata({
  title: "Videoprodukcija",
  description: pageDescription,
  path,
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: { absolute: pageTitle },
  description: pageDescription,
  openGraph: {
    ...baseMetadata.openGraph,
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: pageTitle,
    description: pageDescription,
  },
};

export default function VideoprodukcijaPage() {
  const origin = siteConfig.url.replace(/\/$/, "");
  const pageUrl = absoluteUrl(path);
  const serviceId = `${origin}/videoprodukcija#service`;
  const breadcrumbId = "breadcrumb-video";

  return (
    <>
      <Header />
      <main id="main">
        <VideoPage />
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
                  { name: "Videoprodukcija", path },
                ],
                breadcrumbId,
              ),
              {
                "@type": "WebPage",
                "@id": `${origin}/videoprodukcija#webpage`,
                url: pageUrl,
                name: pageTitle,
                description: pageDescription,
                inLanguage: "sl",
                isPartOf: { "@id": `${origin}/#website` },
                about: { "@id": serviceId },
                breadcrumb: { "@id": `${origin}/#${breadcrumbId}` },
              },
              {
                "@type": "Service",
                "@id": serviceId,
                name: "Videoprodukcija in promocijski videi",
                serviceType: "Videoprodukcija",
                description: pageDescription,
                provider: { "@id": `${origin}/#organization` },
                url: pageUrl,
                areaServed: [
                  { "@type": "City", name: "Cerknica" },
                  { "@type": "AdministrativeArea", name: "Notranjska" },
                  { "@type": "Country", name: "Slovenia" },
                ],
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Videoprodukcija",
                  itemListElement: videoOffers.map((name) => ({
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name,
                    },
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

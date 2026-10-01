import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/sections/Contact";
import { createPageMetadata, breadcrumbJsonLd, serializeJsonLd, absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = createPageMetadata({
  title: "Kontakt",
  description:
    "Kontaktirajte JU-TAN Studio v Cerknici za izdelavo spletnih strani, razvoj programske opreme po meri, poslovne sisteme, avtomatizacijo in AI rešitve.",
  path: "/kontakt",
});

export default function KontaktPage() {
  const origin = siteConfig.url.replace(/\/$/, "");
  return (
    <>
      <Header />
      <main id="main">
        <Contact />
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
                  { name: "Kontakt", path: "/kontakt" },
                ],
                "breadcrumb-contact",
              ),
              {
                "@type": "ContactPage",
                "@id": `${origin}/kontakt#contactpage`,
                url: absoluteUrl("/kontakt"),
                name: "Kontakt",
                description:
                  "Kontaktirajte JU-TAN Studio v Cerknici za izdelavo spletnih strani, razvoj programske opreme po meri, poslovne sisteme, avtomatizacijo in AI rešitve.",
                inLanguage: "sl",
                isPartOf: { "@id": `${origin}/#website` },
                about: { "@id": `${origin}/#organization` },
              },
            ],
          }),
        }}
      />
      <Footer />
    </>
  );
}

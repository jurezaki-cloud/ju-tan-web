import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/lib/data/company";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/sections/Contact";
import {
  createPageMetadata,
  breadcrumbJsonLd,
  serializeJsonLd,
  absoluteUrl,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = createPageMetadata({
  title: "Kontakt – JU-TAN Studio v Cerknici",
  description:
    "Kontaktirajte JU-TAN Studio v Cerknici za grafično oblikovanje, logotipe in celostne podobe, izdelavo spletnih strani, razvoj programske opreme, avtomatizacijo in AI rešitve.",
  path: "/kontakt",
});

export default function KontaktPage() {
  const origin = siteConfig.url.replace(/\/$/, "");
  return (
    <>
      <Header />
      <main id="main">
        <Contact />
        <section
          className="mx-auto max-w-5xl px-6 pb-16"
          aria-labelledby="company-contact-title"
        >
          <h2
            id="company-contact-title"
            className="font-heading text-2xl font-semibold"
          >
            JU-TAN Studio v Cerknici
          </h2>
          <p className="mt-4 leading-7">
            Spletne strani, grafično oblikovanje in programsko opremo po meri
            pripravljamo za podjetja v Cerknici, na Notranjskem in po Sloveniji.
            Povejte nam, kaj potrebujete, in dogovorili se bomo o obsegu ter
            izvedbi projekta.
          </p>
          <address className="mt-6 space-y-2 not-italic">
            <p>{company.legalName}</p>
            <p>
              {company.contact.address.street}, {company.contact.address.postal}
              , {company.contact.address.country}
            </p>
            <p>
              <a href={company.contact.phoneTel}>{company.contact.phone}</a> ·{" "}
              {company.contact.phoneLabel}
            </p>
            <p>
              <a href={company.contact.phoneSecondaryTel}>
                {company.contact.phoneSecondary}
              </a>{" "}
              · {company.contact.phoneSecondaryLabel}
            </p>
            <p>
              <a href={`mailto:${company.contact.email}`}>
                {company.contact.email}
              </a>
            </p>
            <p>Delovni čas: {company.contact.hours}</p>
          </address>
          <nav
            aria-label="Storitve JU-TAN"
            className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-emerald-500"
          >
            <Link href="/spletne-strani-in-ui-ux">
              Izdelava spletnih strani
            </Link>
            <Link href="/graficno-oblikovanje">Grafično oblikovanje</Link>
            <Link href="/izdelava-logotipa">Izdelava logotipa</Link>
            <Link href="/razvoj-programske-opreme">
              Programska oprema po meri
            </Link>
            <Link href="/reference">Reference projektov</Link>
          </nav>
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
                  "Kontaktirajte JU-TAN Studio v Cerknici za grafično oblikovanje, logotipe in celostne podobe, izdelavo spletnih strani, razvoj programske opreme, avtomatizacijo in AI rešitve.",
                inLanguage: "sl",
                isPartOf: { "@id": `${origin}/#website` },
                about: { "@id": `${origin}/#organization` },
                mainEntity: { "@id": `${origin}/#professional` },
                breadcrumb: { "@id": `${origin}/#breadcrumb-contact` },
              },
            ],
          }),
        }}
      />
      <Footer />
    </>
  );
}

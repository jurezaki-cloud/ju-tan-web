import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export const defaultTitle =
  "JU-TAN | Umetna inteligenca, programska oprema in avtomatizacija";

export const defaultDescription =
  "JU-TAN razvija rešitve umetne inteligence, avtomatizacije, programske opreme, spletnih strani in IT infrastrukture za sodobna podjetja.";

export const defaultKeywords = [
  "JU-TAN",
  "umetna inteligenca",
  "avtomatizacija",
  "programska oprema",
  "spletne strani",
  "IT infrastruktura",
  "AI agenti",
  "Slovenija",
] as const;

export const openGraph = {
  type: "website" as const,
  locale: siteConfig.locale,
  url: siteConfig.url,
  siteName: company.name,
  title: defaultTitle,
  description: defaultDescription,
  images: [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: `${company.name} — umetna inteligenca in razvoj programske opreme`,
    },
  ],
};

export const twitter = {
  card: "summary_large_image" as const,
  title: defaultTitle,
  description: defaultDescription,
  images: ["/og-image.jpg"],
};

export function jsonLdGraph() {
  const url = siteConfig.url.replace(/\/$/, "");
  const organizationId = `${url}/#organization`;
  const websiteId = `${url}/#website`;
  const localBusinessId = `${url}/#localbusiness`;
  const logo = absoluteUrl("/logo/ju-tan-studio.png");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: company.name,
        url,
        description: company.description,
        email: company.contact.email,
        logo,
        image: absoluteUrl("/og-image.jpg"),
        address: {
          "@type": "PostalAddress",
          addressCountry: "SI",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: company.name,
        url,
        inLanguage: "sl",
        description: defaultDescription,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "ProfessionalService",
        "@id": localBusinessId,
        name: company.name,
        url,
        email: company.contact.email,
        description: company.description,
        image: absoluteUrl("/og-image.jpg"),
        areaServed: {
          "@type": "Country",
          name: "Slovenia",
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "SI",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "08:00",
          closes: "16:00",
        },
        parentOrganization: { "@id": organizationId },
      },
    ],
  };
}

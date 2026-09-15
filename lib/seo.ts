import type { Metadata } from "next";
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
  ...(process.env.NEXT_PUBLIC_TWITTER_SITE
    ? { site: process.env.NEXT_PUBLIC_TWITTER_SITE }
    : {}),
};

export function createPageMetadata({
  title,
  description,
  path = "/",
}: {
  title?: string;
  description?: string;
  path?: string;
} = {}): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const url = absoluteUrl(canonical);
  const pageTitle = title
    ? `${title} | ${company.name}`
    : defaultTitle;
  const pageDescription = description ?? defaultDescription;

  return {
    title: title ?? { absolute: defaultTitle },
    description: pageDescription,
    alternates: { canonical },
    openGraph: {
      ...openGraph,
      url,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: {
      ...twitter,
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbJsonLd(
  items: readonly { name: string; path: string }[],
  id = "breadcrumb",
) {
  const origin = siteConfig.url.replace(/\/$/, "");

  return {
    "@type": "BreadcrumbList",
    "@id": `${origin}/#${id}`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function jsonLdGraph() {
  const url = siteConfig.url.replace(/\/$/, "");
  const organizationId = `${url}/#organization`;
  const websiteId = `${url}/#website`;
  const webpageId = `${url}/#webpage`;
  const professionalId = `${url}/#professional`;
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
        telephone: [company.contact.phone, company.contact.phoneSecondary],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: company.contact.phone,
            contactType: company.contact.phoneLabel,
            availableLanguage: "sl",
          },
          {
            "@type": "ContactPoint",
            telephone: company.contact.phoneSecondary,
            contactType: company.contact.phoneSecondaryLabel,
            availableLanguage: "sl",
          },
        ],
        logo,
        image: absoluteUrl("/og-image.jpg"),
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
        "@type": "WebPage",
        "@id": webpageId,
        url,
        name: defaultTitle,
        description: defaultDescription,
        inLanguage: "sl",
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        breadcrumb: { "@id": `${url}/#breadcrumb` },
      },
      breadcrumbJsonLd([{ name: "Domov", path: "/" }]),
      {
        "@type": "ProfessionalService",
        "@id": professionalId,
        name: company.name,
        url,
        email: company.contact.email,
        telephone: [company.contact.phone, company.contact.phoneSecondary],
        description: company.description,
        image: absoluteUrl("/og-image.jpg"),
        logo,
        areaServed: {
          "@type": "Country",
          name: "Slovenia",
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

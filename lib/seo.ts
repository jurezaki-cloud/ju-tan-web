import type { Metadata } from "next";
import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";
import { offerCatalog } from "@/lib/data/services";
import { brandAssets } from "@/brand/theme";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export const defaultTitle =
  "JU-TAN | Digitalne rešitve, programska oprema in poslovni sistemi";

export const defaultDescription =
  "JU-TAN povezuje oblikovanje, razvoj in tehnologijo v spletne izkušnje, programsko opremo, poslovne sisteme in AI za podjetja v Sloveniji.";

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
      alt: "JU-TAN — digitalne rešitve in razvoj programske opreme",
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
    alternates: {
      canonical,
      languages: { sl: url, "x-default": url },
    },
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
  const logo = absoluteUrl(brandAssets.logoPng);
  const postalParts = company.contact.address.postal.split(" ");
  const postalCode = postalParts[0] ?? company.contact.address.postal;
  const addressLocality = postalParts.slice(1).join(" ") || company.contact.address.postal;
  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: company.contact.address.street,
    postalCode,
    addressLocality,
    addressCountry: "SI",
  };

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
        address: postalAddress,
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
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": professionalId,
        name: company.name,
        url,
        email: company.contact.email,
        telephone: [company.contact.phone, company.contact.phoneSecondary],
        description: company.description,
        image: absoluteUrl("/og-image.jpg"),
        logo,
        address: postalAddress,
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
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Storitve",
          itemListElement: offerCatalog.map((group) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: group.name,
              description: group.description,
            },
          })),
        },
      },
    ],
  };
}

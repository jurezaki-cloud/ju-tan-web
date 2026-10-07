import type { Metadata } from "next";
import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";
import { offerCatalog } from "@/lib/data/services";
import { brandAssets } from "@/brand/theme";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export const defaultTitle =
  "JU-TAN Studio | Spletne strani, grafično oblikovanje in programska oprema";

export const defaultDescription =
  "JU-TAN Studio iz Cerknice izdeluje spletne strani, logotipe in celostne grafične podobe ter razvija programsko opremo, poslovne sisteme, avtomatizacije in AI rešitve za podjetja v Sloveniji.";

export const defaultKeywords = [
  "JU-TAN Studio",
  "izdelava spletnih strani",
  "spletne strani Cerknica",
  "izdelava spletnih strani za podjetja",
  "grafično oblikovanje Cerknica",
  "izdelava logotipa",
  "celostna grafična podoba",
  "oblikovanje letakov in vizitk",
  "razvoj programske opreme po meri",
  "poslovni program za mala podjetja",
  "program za račune in ponudbe",
  "avtomatizacija poslovnih procesov",
  "AI rešitve za podjetja",
  "Cerknica",
  "Notranjska",
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
      alt: "JU-TAN Studio — grafično oblikovanje, spletne strani in programska oprema",
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
  const pageTitle = title ? `${title} | ${company.name}` : defaultTitle;
  const pageDescription = description ?? defaultDescription;

  return {
    title: title ?? { absolute: defaultTitle },
    description: pageDescription,
    alternates: {
      canonical: url,
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

function schemaIds() {
  const url = siteConfig.url.replace(/\/$/, "");
  return {
    url,
    organizationId: `${url}/#organization`,
    websiteId: `${url}/#website`,
    webpageId: `${url}/#webpage`,
    professionalId: `${url}/#professional`,
  };
}

export const serviceAreas = [
  { "@type": "City", name: "Cerknica" },
  { "@type": "Place", name: "Notranjska" },
  { "@type": "Country", name: "Slovenija" },
];

function postalAddress() {
  const postalParts = company.contact.address.postal.split(" ");
  const postalCode = postalParts[0] ?? company.contact.address.postal;
  const addressLocality =
    postalParts.slice(1).join(" ") || company.contact.address.postal;

  return {
    "@type": "PostalAddress",
    streetAddress: company.contact.address.street,
    postalCode,
    addressLocality,
    addressCountry: "SI",
  };
}

/** Sitewide entity schema — injected from root layout on every route. */
export function sitewideJsonLdGraph() {
  const { url, organizationId, websiteId, professionalId } = schemaIds();
  const logo = absoluteUrl(brandAssets.logoPng);
  const address = postalAddress();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: company.name,
        alternateName: "JU-TAN Studio",
        sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
        legalName: company.legalName,
        url,
        description: defaultDescription,
        email: company.contact.email,
        telephone: company.contact.phone,
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
        address,
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
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": professionalId,
        name: company.name,
        url,
        email: company.contact.email,
        telephone: company.contact.phone,
        description: defaultDescription,
        image: absoluteUrl("/og-image.jpg"),
        logo,
        address,
        areaServed: serviceAreas,
        legalName: company.legalName,
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
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
              provider: { "@id": professionalId },
              areaServed: serviceAreas,
            },
          })),
        },
      },
    ],
  };
}

/** Homepage-only WebPage + BreadcrumbList — inject from app/page.tsx only. */
export function homepageJsonLdGraph() {
  const { url, organizationId, websiteId, webpageId } = schemaIds();

  return {
    "@context": "https://schema.org",
    "@graph": [
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
    ],
  };
}

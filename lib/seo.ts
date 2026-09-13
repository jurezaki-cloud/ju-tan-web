import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export const defaultTitle =
  "JU-TAN Studio | AI avtomatizacija, razvoj in infrastruktura";

export const defaultKeywords = [
  "JU-TAN Studio",
  "AI avtomatizacija",
  "razvoj programske opreme",
  "spletne rešitve",
  "oblačna infrastruktura",
  "Slovenija",
] as const;

export const openGraph = {
  type: "website" as const,
  locale: siteConfig.locale,
  url: siteConfig.url,
  siteName: siteConfig.name,
  title: defaultTitle,
  description: company.description,
  images: [
    {
      url: "/logo/ju-tan-studio.png",
      width: 52,
      height: 52,
      alt: company.name,
    },
  ],
};

export const twitter = {
  card: "summary" as const,
  title: defaultTitle,
  description: company.description,
  images: ["/logo/ju-tan-studio.png"],
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: siteConfig.url,
    description: company.description,
    logo: absoluteUrl("/logo/ju-tan-studio.png"),
    email: "info@ju-tan.si",
  };
}

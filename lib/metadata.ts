import type { Metadata } from "next";
import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";
import {
  defaultKeywords,
  defaultTitle,
  openGraph,
  twitter,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: company.description,
  keywords: [...defaultKeywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph,
  twitter,
  robots: {
    index: true,
    follow: true,
  },
};

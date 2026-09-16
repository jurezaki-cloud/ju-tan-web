import type { Metadata, Viewport } from "next";
import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";
import { brandAssets } from "@/brand/theme";
import { colors } from "@/design";
import {
  defaultDescription,
  defaultKeywords,
  defaultTitle,
  openGraph,
  twitter,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${company.name}`,
  },
  description: defaultDescription,
  keywords: [...defaultKeywords],
  authors: [{ name: company.name, url: siteConfig.url }],
  creator: company.name,
  publisher: company.name,
  applicationName: company.name,
  category: "technology",
  alternates: {
    canonical: "/",
    languages: { sl: "/", "x-default": "/" },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph,
  twitter,
  icons: {
    icon: [
      { url: brandAssets.favicon, type: "image/svg+xml" },
      { url: brandAssets.favicon16, sizes: "16x16", type: "image/png" },
      { url: brandAssets.favicon32, sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: brandAssets.appleTouch, sizes: "180x180" }],
    shortcut: [brandAssets.favicon],
  },
  manifest: "/manifest.webmanifest",
  other: {
    "msapplication-TileColor": colors.background,
    "msapplication-config": brandAssets.browserconfig,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#050816" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

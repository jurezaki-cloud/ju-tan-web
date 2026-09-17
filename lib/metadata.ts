import type { Metadata, Viewport } from "next";
import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";
import { brandAssets, brandDark, brandLight } from "@/brand/theme";
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
      { url: brandAssets.icons.favicon, sizes: "any", type: "image/x-icon" },
      { url: brandAssets.icons.favicon16, sizes: "16x16", type: "image/png" },
      { url: brandAssets.icons.favicon32, sizes: "32x32", type: "image/png" },
      { url: brandAssets.icons.favicon64, sizes: "64x64", type: "image/png" },
      { url: brandAssets.icons.favicon128, sizes: "128x128", type: "image/png" },
      { url: brandAssets.icons.favicon256, sizes: "256x256", type: "image/png" },
    ],
    apple: [
      {
        url: brandAssets.icons.appleTouch,
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [brandAssets.icons.favicon],
  },
  manifest: "/manifest.webmanifest",
  other: {
    "msapplication-TileColor": brandDark,
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
    { media: "(prefers-color-scheme: light)", color: brandLight.toLowerCase() },
    { media: "(prefers-color-scheme: dark)", color: brandDark.toLowerCase() },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

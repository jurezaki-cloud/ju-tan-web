import type { Metadata, Viewport } from "next";
import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";
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
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph,
  twitter,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
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
};

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteConfig.url.replace(/\/$/, "");

  // Omit lastModified until a reliable per-page content timestamp is available.
  return [
    {
      url: `${origin}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${origin}/ju-tan-office`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/razvoj-programske-opreme`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/spletne-strani-in-ui-ux`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/reference`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${origin}/graficno-oblikovanje`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/kontakt`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/politika-zasebnosti`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${origin}/politika-piskotkov`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

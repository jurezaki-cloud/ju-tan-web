import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/logout",
        "/admin",
        "/admin/",
        "/dashboard",
        "/dashboard/",
        "/crm",
        "/crm/",
        "/clients",
        "/clients/",
        "/projects",
        "/projects/",
        "/documents",
        "/documents/",
        "/tickets",
        "/tickets/",
        "/ai",
        "/ai/",
        "/settings",
        "/settings/",
        "/profile",
        "/portal",
        "/portal/",
        "/invite/",
        "/access-denied",
        "/session-expired",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

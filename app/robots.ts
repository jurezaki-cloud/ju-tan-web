import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api$", "/api/", "/admin$", "/admin/", "/login", "/logout", "/invite$", "/invite/", "/dashboard", "/crm$", "/crm/", "/clients$", "/clients/", "/documents", "/projects", "/settings", "/tickets", "/portal", "/profile", "/ai", "/access-denied", "/session-expired"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/login", "/logout", "/invite/", "/dashboard", "/crm/", "/clients/", "/documents", "/projects", "/settings", "/tickets", "/portal", "/profile", "/ai"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

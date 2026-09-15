import type { MetadataRoute } from "next";
import { company } from "@/lib/data/company";
import { defaultDescription } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.name,
    description: defaultDescription,
    start_url: "/",
    display: "standalone",
    theme_color: "#16a34a",
    background_color: "#050816",
    lang: "sl",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/android-chrome-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

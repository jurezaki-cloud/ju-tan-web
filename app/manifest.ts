import type { MetadataRoute } from "next";
import { defaultDescription } from "@/lib/seo";
import {
  brandAssets,
  brandColor,
  brandDark,
  brandName,
  brandShort,
} from "@/brand/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brandName,
    short_name: brandShort,
    description: defaultDescription,
    start_url: "/",
    display: "standalone",
    theme_color: brandColor.toLowerCase(),
    background_color: brandDark,
    lang: "sl",
    icons: [
      {
        src: brandAssets.icons.favicon,
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: brandAssets.icons.android192,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: brandAssets.icons.android512,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: brandAssets.icons.appleTouch,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

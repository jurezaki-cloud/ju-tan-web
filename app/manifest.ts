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
        src: brandAssets.favicon,
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: brandAssets.favicon16,
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: brandAssets.favicon32,
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: brandAssets.mark,
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: brandAssets.appleTouch,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

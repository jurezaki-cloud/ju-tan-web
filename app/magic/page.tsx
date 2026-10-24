import type { Metadata } from "next";
import MagicStudio from "@/components/magic/MagicStudio";
import { siteConfig } from "@/lib/config";

const title = "MAGIC SURPRISE – brezplačne voščilnice in presenečenja";
const description =
  "Ustvari animirano voščilnico, skrivno sporočilo, digitalno presenečenje ali osebno vabilo. Brez prijave. Brezplačno. Deli z eno povezavo.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/magic" },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/magic`,
    locale: "sl_SI",
    type: "website",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "JU-TAN MAGIC SURPRISE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/og-image.png"],
  },
  referrer: "no-referrer",
};
export default function MagicPage() {
  return <MagicStudio />;
}

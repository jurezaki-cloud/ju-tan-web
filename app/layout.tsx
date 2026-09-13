import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = new URL("https://ju-tan.com");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "JU-TAN | Umetna inteligenca, programska oprema in avtomatizacija",
    template: "%s | JU-TAN",
  },
  description:
    "JU-TAN razvija rešitve umetne inteligence, avtomatizacije, programske opreme, spletnih strani in IT infrastrukture za sodobna podjetja.",
  keywords: [
    "JU-TAN",
    "umetna inteligenca",
    "avtomatizacija",
    "programska oprema",
    "spletne strani",
    "IT infrastruktura",
    "Slovenija",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JU-TAN | Umetna inteligenca, programska oprema in avtomatizacija",
    description:
      "Premium slovenska spletna predstavitev podjetja JU-TAN za AI, razvoj programske opreme in avtomatizacijo.",
    url: siteUrl,
    siteName: "JU-TAN",
    locale: "sl_SI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JU-TAN | Umetna inteligenca, programska oprema in avtomatizacija",
    description:
      "Premium slovenska spletna predstavitev podjetja JU-TAN za AI, razvoj programske opreme in avtomatizacijo.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="sl" className={geist.variable}>
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        {children}
      </body>
    </html>
  );
}

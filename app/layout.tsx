import "./globals.css";
import { Geist, Syne } from "next/font/google";
import type { ReactNode } from "react";
import { jsonLdGraph, serializeJsonLd } from "@/lib/seo";
import Providers from "@/components/common/Providers";
import JuTanAgentLazy from "@/components/ai/JuTanAgentLazy";

export { metadata, viewport } from "@/lib/metadata";

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const jsonLd = jsonLdGraph();

  return (
    <html
      lang="sl"
      className={`${geist.variable} ${syne.variable}`}
      // next-themes writes `class="dark|light"` on <html> before React hydrates.
      // Official requirement: https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#050816] font-sans text-white antialiased light:bg-slate-50 light:text-slate-900">
        <Providers>
        <a href="#main" className="skip-link">
          Preskoči na vsebino
        </a>
        {children}
        <JuTanAgentLazy />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(jsonLd),
          }}
        />
        </Providers>
      </body>
    </html>
  );
}

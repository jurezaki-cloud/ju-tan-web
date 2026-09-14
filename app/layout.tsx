import "./globals.css";
import { Geist, Syne } from "next/font/google";
import type { ReactNode } from "react";
import { jsonLdGraph } from "@/lib/seo";
import Providers from "@/components/common/Providers";

export { metadata, viewport } from "@/lib/metadata";

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const jsonLd = jsonLdGraph();

  return (
    <html lang="sl" className={`${geist.variable} ${syne.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#050816] font-sans text-white antialiased light:bg-slate-50 light:text-slate-900">
        <Providers>
        <a href="#main" className="skip-link">
          Preskoči na vsebino
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        </Providers>
      </body>
    </html>
  );
}

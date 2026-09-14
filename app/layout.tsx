import "./globals.css";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { jsonLdGraph } from "@/lib/seo";

export { metadata, viewport } from "@/lib/metadata";

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
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
    <html lang="sl" className={geist.variable}>
      <body className="min-h-screen bg-[#050816] text-white antialiased">
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
      </body>
    </html>
  );
}

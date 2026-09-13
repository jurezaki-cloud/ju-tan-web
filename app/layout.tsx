import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JU-TAN | AI • Software • Automation",
  description:
    "JU-TAN razvija AI avtomatizacije, poslovno programsko opremo, spletne strani in IT rešitve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl">
      <body className="bg-[#050816] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
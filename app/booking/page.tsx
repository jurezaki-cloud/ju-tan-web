import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Booking from "@/components/sections/Booking";
import { createPageMetadata, breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Povpraševanje",
  description:
    "Pošljite povpraševanje ekipi JU-TAN za umetno inteligenco, programsko opremo, avtomatizacijo, splet in IT infrastrukturo.",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Booking heading="h1" />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            ...breadcrumbJsonLd(
              [
                { name: "Domov", path: "/" },
                { name: "Povpraševanje", path: "/booking" },
              ],
              "breadcrumb-booking",
            ),
          }),
        }}
      />
      <Footer />
    </>
  );
}

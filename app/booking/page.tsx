import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Booking from "@/components/sections/Booking";
import { createPageMetadata, breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Rezervacija posveta",
  description:
    "Rezervirajte posvet z ekipo JU-TAN za umetno inteligenco, splet, aplikacije, oblikovanje ali IT svetovanje.",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Booking />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            ...breadcrumbJsonLd(
              [
                { name: "Domov", path: "/" },
                { name: "Termin", path: "/booking" },
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

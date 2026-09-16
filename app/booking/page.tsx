import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Booking from "@/components/sections/Booking";
import { createPageMetadata, breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Posvet",
  description:
    "Oddajte povpraševanje JU-TAN. Termin uskladimo po e-pošti ali telefonu; na spletu ni koledarja.",
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
                { name: "Posvet", path: "/booking" },
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

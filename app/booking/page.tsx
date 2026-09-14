import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/layout/Footer";
import Booking from "@/components/sections/Booking";
import { createPageMetadata } from "@/lib/seo";

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
      <Footer />
    </>
  );
}

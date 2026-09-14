import type { Metadata } from "next";
import Navbar from "@/components/navbar";
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
      <Navbar />
      <main id="main" className="pt-[calc(4.375rem+env(safe-area-inset-top,0px))]">
        <Booking />
      </main>
      <Footer />
    </>
  );
}

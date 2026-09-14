import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/layout/Footer";
import Booking from "@/components/sections/Booking";

export const metadata: Metadata = {
  title: "Rezervacija posveta",
  description:
    "Rezervirajte posvet z ekipo JU-TAN za umetno inteligenco, splet, aplikacije, oblikovanje ali IT svetovanje.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Rezervacija posveta | JU-TAN",
    description:
      "Izberite storitev, svetovalca in termin za brezplačen ali usmerjen posvet.",
    url: "/booking",
    type: "website",
  },
};

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-[70px]">
        <Booking />
      </main>
      <Footer />
    </>
  );
}

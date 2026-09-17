import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
import Footer from "@/components/layout/Footer";
import { createPageMetadata } from "@/lib/seo";

const JuTanOffice = dynamic(() => import("@/components/sections/JuTanOffice"));
const Process = dynamic(() => import("@/components/sections/Process"));
const Trust = dynamic(() => import("@/components/sections/Trust"));
const CreativeProduction = dynamic(
  () => import("@/components/sections/CreativeProduction"),
);
const Booking = dynamic(() => import("@/components/sections/Booking"));

export const metadata: Metadata = createPageMetadata({ path: "/" });

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <JuTanOffice />
        <Process />
        <Trust />
        <CreativeProduction />
        <Booking variant="homepage" />
      </main>
      <Footer />
    </>
  );
}

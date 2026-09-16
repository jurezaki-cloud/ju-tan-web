import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Hero from "@/components/hero/Hero";
import TrustBar from "@/components/common/TrustBar";
import LogoStrip from "@/components/common/LogoStrip";
import Value from "@/components/sections/Value";
import Services from "@/components/sections/Services";
import Trust from "@/components/sections/Trust";
import Footer from "@/components/layout/Footer";
import { createPageMetadata } from "@/lib/seo";

const Process = dynamic(() => import("@/components/sections/Process"));
const Technologies = dynamic(() => import("@/components/sections/Technologies"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const About = dynamic(() => import("@/components/sections/About"));
const Booking = dynamic(() => import("@/components/sections/Booking"));

export const metadata: Metadata = createPageMetadata({ path: "/" });

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <TrustBar />
        <LogoStrip />
        <Value />
        <Services />
        <Process />
        <Technologies />
        <Projects />
        <About />
        <Trust />
        <Booking />
      </main>
      <Footer />
    </>
  );
}

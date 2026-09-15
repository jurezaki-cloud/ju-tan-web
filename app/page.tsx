import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Technologies from "@/components/sections/Technologies";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Booking from "@/components/sections/Booking";
import Privacy from "@/components/sections/Privacy";
import Footer from "@/components/layout/Footer";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({ path: "/" });

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Process />
        <Technologies />
        <Projects />
        <About />
        <Booking />
        <Contact />
        <Privacy />
      </main>
      <Footer />
    </>
  );
}

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
import PremiumCTA from "@/components/common/PremiumCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({ path: "/" });

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <section className="below-fold relative overflow-hidden section-y">
          <div className="container">
            <PremiumCTA
              heading="h2"
              title="Od ideje do produkcije v tednih, ne mesecih."
              description="Povejte nam izziv. Pripravimo tehnični predlog, arhitekturo in jasen načrt izvedbe."
              action="Brezplačen posvet"
            />
          </div>
        </section>
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

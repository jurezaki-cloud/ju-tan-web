import Navbar from "@/components/navbar";
import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Technologies from "@/components/sections/Technologies";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Process />
        <Technologies />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

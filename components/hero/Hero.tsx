"use client";

import { FadeIn } from "@/components/animations";
import AuroraBackground from "@/components/background/AuroraBackground";
import AINetwork from "@/components/background/AINetwork";
import HeroBackground from "./HeroBackground";
import FloatingCards from "./FloatingCards";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28">
      <AuroraBackground />
      <AINetwork />
      <HeroBackground />
      <FloatingCards />

      <div className="container relative z-10">
        <FadeIn duration={0.8}>
          <HeroContent />
        </FadeIn>

        <FadeIn delay={0.2}>
          <HeroButtons />
        </FadeIn>

        <FadeIn delay={0.4}>
          <HeroStats />
        </FadeIn>
      </div>

      <ScrollIndicator />
    </section>
  );
}

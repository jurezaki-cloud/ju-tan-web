"use client";

import { FadeIn } from "@/components/animations";
import EcosystemNetwork from "@/components/animations/AINetwork";
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
    <section id="home" className="relative min-h-screen overflow-hidden pt-28">
      <AuroraBackground />
      <AINetwork />
      <HeroBackground />

      <div className="container relative z-10">
        <div className="grid items-center gap-16 py-12 lg:grid-cols-2 lg:py-20">
          <div>
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

          <div className="relative mx-auto aspect-square w-full max-w-[540px]">
            <EcosystemNetwork />
            <FloatingCards />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

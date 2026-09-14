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
    <section id="home" className="relative min-h-[82vh] overflow-hidden pt-[70px] lg:pt-[80px]">
      <AuroraBackground />
      <AINetwork />
      <HeroBackground />

      <div className="container relative z-10">
        <div className="grid items-center gap-6 py-4 lg:grid-cols-2 lg:py-5">
          <div>
            <FadeIn>
              <HeroContent />
            </FadeIn>

            <FadeIn delay={0.2}>
              <HeroButtons />
            </FadeIn>

            <FadeIn delay={0.4}>
              <HeroStats />
            </FadeIn>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[390px]">
            <EcosystemNetwork />
            <FloatingCards />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

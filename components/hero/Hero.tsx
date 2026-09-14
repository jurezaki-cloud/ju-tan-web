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
    <section
      id="home"
      className="relative min-h-[88vh] overflow-hidden pt-[78px] lg:pt-[88px]"
    >
      <AuroraBackground />
      <AINetwork />
      <HeroBackground />

      <div className="container relative z-10">
        <div className="grid items-center gap-8 py-6 lg:grid-cols-2 lg:gap-10 lg:py-8">
          <div>
            <HeroContent />
            <HeroButtons />
            <HeroStats />
          </div>

          <FadeIn delay={0.12} className="relative mx-auto aspect-square w-full max-w-[420px]">
            <EcosystemNetwork />
            <FloatingCards />
          </FadeIn>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

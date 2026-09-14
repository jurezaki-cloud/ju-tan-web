import AuroraBackground from "@/components/background/AuroraBackground";
import HeroBackground from "./HeroBackground";
import HeroCanvas from "./HeroCanvas";
import FloatingCards from "./FloatingCards";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";
import ScrollIndicator from "./ScrollIndicator";
import EcosystemNetwork from "@/components/animations/AINetwork";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[88dvh] overflow-hidden pt-[calc(4.875rem+env(safe-area-inset-top,0px))] pb-[max(4.5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] lg:pt-[calc(5.5rem+env(safe-area-inset-top,0px))]"
    >
      <AuroraBackground />
      <HeroCanvas />
      <HeroBackground />

      <div className="container relative z-10 max-w-6xl overflow-x-hidden">
        <div className="grid items-center gap-6 py-4 sm:gap-8 sm:py-6 lg:grid-cols-2 lg:gap-10 lg:py-8">
          <div className="min-w-0">
            <HeroContent />
            <HeroButtons />
            <HeroStats />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[min(420px,100%)] overflow-hidden sm:overflow-visible">
            <EcosystemNetwork />
            <FloatingCards />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

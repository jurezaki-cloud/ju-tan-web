import AuroraBackground from "@/components/background/AuroraBackground";
import HeroBackground from "./HeroBackground";
import HeroCanvas from "./HeroCanvas";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";
import ScrollIndicator from "./ScrollIndicator";
import HeroStage from "./HeroStage";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[88dvh] overflow-hidden pt-8 pb-[max(4.5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] lg:pt-12"
    >
      <AuroraBackground />
      <HeroCanvas />
      <HeroBackground />

      <div className="container relative z-10 max-w-6xl overflow-x-hidden">
        <div className="grid items-center gap-6 py-4 sm:gap-8 sm:py-6 lg:grid-cols-2 lg:gap-10 lg:py-8">
          <div className="relative order-1 lg:order-2">
            <HeroStage />
          </div>

          <div className="order-2 min-w-0 lg:order-1">
            <HeroContent />
            <HeroButtons />
            <HeroStats />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

import HeroBackground from "./HeroBackground";
import HeroCanvas from "./HeroCanvas";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import ScrollIndicator from "./ScrollIndicator";
import HeroStage from "./HeroStage";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[88dvh] overflow-hidden pt-[calc(5rem+0.5rem)] pb-[max(4.5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] lg:min-h-[92dvh] lg:pt-[calc(5rem+2rem)] lg:pb-16"
    >
      <HeroCanvas />
      <HeroBackground />

      <div className="container relative z-10 max-w-6xl overflow-x-hidden lg:max-w-7xl">
        <div className="grid items-center gap-8 py-6 sm:gap-10 sm:py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
          <div className="min-w-0">
            <HeroContent />
            <HeroButtons />
          </div>

          <div className="relative">
            <HeroStage />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

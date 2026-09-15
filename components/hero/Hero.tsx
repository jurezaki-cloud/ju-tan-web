import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import ScrollIndicator from "./ScrollIndicator";
import HeroStage from "./HeroStage";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-[calc(4rem+0.75rem)] pb-16 lg:pt-[calc(4rem+1.75rem)] lg:pb-14"
    >
      <HeroBackground />

      <div className="container relative z-10 grid items-center gap-8 py-2 sm:gap-10 xl:grid-cols-[minmax(0,34rem)_minmax(16rem,1fr)] xl:gap-10 xl:py-4">
        <div className="min-w-0">
          <HeroContent />
          <HeroButtons />
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[20.5rem] sm:max-w-[24rem] xl:mr-0 xl:max-w-[min(28rem,38vw)]">
          <HeroStage />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

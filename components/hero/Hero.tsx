import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import ScrollIndicator from "./ScrollIndicator";
import HeroStage from "./HeroStage";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-[calc(4rem+0.5rem)] pb-6 lg:pt-[calc(4rem+1.2rem)] lg:pb-8"
    >
      <HeroBackground />

      <div className="container relative z-10 grid items-center gap-8 py-3 sm:gap-10 xl:grid-cols-[minmax(0,35rem)_minmax(0,1fr)] xl:gap-10 xl:py-5">
        <div className="min-w-0">
          <HeroContent />
          <HeroButtons />
        </div>

        <div className="relative mx-auto w-full max-w-[33rem] xl:mr-0 xl:max-w-[min(34rem,40vw)]">
          <HeroStage />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

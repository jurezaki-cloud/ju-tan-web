import { Snowflake } from "lucide-react";
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-16 h-36 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_68%)] light:bg-[radial-gradient(ellipse_at_top,rgba(217,119,6,0.12),transparent_68%)]"
      />

      <div className="container relative z-10 grid items-center gap-8 py-3 sm:gap-10 xl:grid-cols-[minmax(0,35rem)_minmax(0,1fr)] xl:gap-10 xl:py-5">
        <div className="min-w-0">
          <HeroContent />
          <HeroButtons />
          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-amber-200 light:text-amber-800">
            <Snowflake aria-hidden="true" className="size-4 shrink-0" />
            Lepe praznike vam želi JU-TAN Studio.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[33rem] xl:mr-0 xl:max-w-[min(34rem,40vw)]">
          <HeroStage />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

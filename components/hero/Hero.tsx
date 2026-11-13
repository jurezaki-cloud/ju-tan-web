import { Snowflake } from "lucide-react";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import ScrollIndicator from "./ScrollIndicator";
import HeroStage from "./HeroStage";
import styles from "./HeroSnow.module.css";

const snowflakes = [
  { left: 4, size: 19, duration: 11, delay: -2 },
  { left: 12, size: 10, duration: 15, delay: -10 },
  { left: 20, size: 25, duration: 16, delay: -8 },
  { left: 29, size: 14, duration: 12, delay: -1 },
  { left: 37, size: 18, duration: 14, delay: -11 },
  { left: 46, size: 11, duration: 10, delay: -4 },
  { left: 54, size: 23, duration: 15, delay: -13 },
  { left: 62, size: 13, duration: 12, delay: -6 },
  { left: 71, size: 18, duration: 13, delay: -2 },
  { left: 78, size: 27, duration: 17, delay: -5 },
  { left: 86, size: 12, duration: 10, delay: -8 },
  { left: 94, size: 21, duration: 14, delay: -7 },
];

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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-sky-100/65 motion-reduce:hidden light:text-sky-700/45"
      >
        {snowflakes.map(({ left, size, duration, delay }) => (
          <span
            key={left}
            className={styles.fall}
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            <Snowflake
              size={size}
              className={styles.drift}
              style={{ animationDelay: `${delay}s` }}
            />
          </span>
        ))}
      </div>

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

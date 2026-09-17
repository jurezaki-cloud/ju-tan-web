import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import { bodyClass, kickerClass } from "@/design";

const labels = [
  "Videoprodukcija",
  "Digitalne vsebine",
  "Predstavitve",
] as const;

export default function CreativeProduction() {
  return (
    <Section
      belowFold
      className="!py-0"
      innerClassName="overflow-x-hidden"
    >
      <div className="mx-auto w-full max-w-[1080px] border-y border-white/8 py-6 sm:py-7 md:py-8 light:border-slate-200/80">
        <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-[minmax(10rem,12.5rem)_minmax(0,36rem)] lg:items-start lg:gap-x-10">
          <FadeIn className="lg:pt-[0.42rem]" y={10}>
            <div className="min-w-0">
              <p className={kickerClass}>KREATIVNA PRODUKCIJA</p>
            </div>
          </FadeIn>

          <div className="min-w-0 max-w-[36rem]">
            <FadeIn delay={0.04} y={10}>
              <h2 className="heading-display mt-3.5 font-heading font-semibold break-words text-white light:text-slate-900">
                <span className="block">Tehnologija potrebuje</span>
                <span className="block">tudi dobro zgodbo.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.1} y={10}>
              <p className={`${bodyClass} mt-3.5 max-w-[33rem] text-slate-300 light:text-slate-600`}>
                Digitalne izdelke in podjetja podpiramo tudi z vizualnimi
                vsebinami in videoprodukcijo.
              </p>
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 light:text-slate-500 sm:text-[12px]">
                {labels.join("  ·  ").toUpperCase()}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </Section>
  );
}

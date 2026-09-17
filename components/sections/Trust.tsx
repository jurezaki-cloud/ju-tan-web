import Section from "@/components/common/Section";
import { FadeIn } from "@/components/animations";
import { bodyClass, kickerClass } from "@/design";
import { cn } from "@/lib/utils";

const principles = [
  {
    title: "Koda ostane vaša",
    text: "Jasno lastništvo projekta in dokumentacije.",
  },
  {
    title: "Brez nepotrebne vezave",
    text: "Arhitektura, ki ne temelji na odvisnosti od enega ponudnika.",
  },
  {
    title: "Zgrajeno za rast",
    text: "Modularne rešitve, ki jih je mogoče nadgrajevati.",
  },
  {
    title: "Dolgoročna podpora",
    text: "Po uvedbi ostanemo partner pri nadaljnjem razvoju.",
  },
] as const;

export default function Trust() {
  return (
    <Section id="company" belowFold innerClassName="overflow-x-hidden">
      <div className="mx-auto grid w-full max-w-[1220px] gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-start lg:gap-12">
        <FadeIn className="lg:pt-1">
          <div className="max-w-[34rem]">
            <p className={cn(kickerClass, "light:text-slate-500")}>PODJETJE</p>
            <h2 className="heading-display mt-3.5 font-heading font-semibold break-words text-white light:text-slate-900">
              Partner tudi po prvi različici.
            </h2>
            <p className={`${bodyClass} mt-3.5 max-w-[38rem] light:text-slate-600`}>
              Dobra programska rešitev ni zaključena z objavo. Zgrajena mora biti
              tako, da jo je mogoče razumeti, vzdrževati in razvijati naprej.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="relative border-y border-white/8 light:border-slate-200/80">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/8 light:bg-slate-200/80 md:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-white/8 light:bg-slate-200/80 md:block"
            />

            <div className="grid md:grid-cols-2">
              {principles.map((principle, index) => (
                <FadeIn key={principle.title} delay={0.12 + index * 0.04} y={8}>
                  <article
                    className={cn(
                      "group relative min-w-0 py-6 sm:py-7 md:px-8 md:py-8 lg:px-10 lg:py-9",
                      index > 0 &&
                        "border-t border-white/8 light:border-slate-200/80 md:border-t-0",
                      index % 2 === 1 && "md:pl-10 lg:pl-12",
                      index < 2 ? "md:pb-9 lg:pb-10" : "md:pt-9 lg:pt-10",
                    )}
                  >
                    <div className="flex max-w-[21rem] items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#16a34a]/72 transition-colors duration-300 group-hover:bg-[#16a34a] motion-reduce:transition-none"
                      />
                      <div className="min-w-0">
                        <h3 className="font-heading text-[1.3rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-white/96 light:text-slate-900 light:group-hover:text-slate-950 motion-reduce:transition-none md:text-[1.4rem]">
                          {principle.title}
                        </h3>
                        <p
                          className={`${bodyClass} mt-3 max-w-[25rem] text-slate-400/92 light:text-slate-600`}
                        >
                          {principle.text}
                        </p>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

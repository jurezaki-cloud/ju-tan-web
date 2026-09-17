import Section from "@/components/common/Section";
import { FadeIn } from "@/components/animations";
import { bodyClass, kickerClass } from "@/design";
import { cn } from "@/lib/utils";

const phases = [
  {
    number: "01",
    title: "Razumemo",
    description: "Poslovni cilj, uporabnika in okolje.",
  },
  {
    number: "02",
    title: "Načrtujemo",
    description: "Izkušnjo, arhitekturo in povezave.",
  },
  {
    number: "03",
    title: "Razvijemo",
    description: "Rešitev po preverljivih korakih.",
  },
  {
    number: "04",
    title: "Razvijamo naprej",
    description: "Vzdrževanje, nadgradnje in podpora.",
  },
] as const;

export default function Process() {
  return (
    <Section id="process" belowFold innerClassName="overflow-x-hidden">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start lg:gap-14">
        <FadeIn className="lg:pt-1">
          <div className="max-w-[34rem]">
            <p className={kickerClass}>NAČIN DELA</p>
            <h2 className="heading-display mt-3.5 font-heading font-semibold break-words text-white light:text-slate-900">
              <span className="block">Oblikovano premišljeno.</span>
              <span className="mt-1 block">Zgrajeno inženirsko.</span>
            </h2>
            <p className={`${bodyClass} mt-3.5 max-w-[38rem] light:text-slate-600`}>
              Proces ostaja jasen, kratek in preverljiv od prvega razumevanja do nadaljnjega razvoja.
            </p>
          </div>
        </FadeIn>

        <ol className="border-y border-white/8 light:border-slate-200/80">
          {phases.map((phase, index) => (
            <li
              key={phase.number}
              className={cn(
                "group transition-colors duration-300 motion-reduce:transition-none",
                index > 0 &&
                  "border-t border-white/8 hover:border-white/14 light:border-slate-200/80 light:hover:border-slate-300/90",
              )}
            >
              <FadeIn delay={0.06 + index * 0.05}>
                <div
                  className={cn(
                    "grid items-start gap-3.5 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5 md:gap-6 md:py-8 lg:py-[2.15rem]",
                    index === phases.length - 1 && "pb-9 md:pb-10 lg:pb-11",
                  )}
                >
                  <p className="font-heading text-[1rem] font-semibold leading-none tabular-nums tracking-[0.12em] text-[#16a34a]/75 transition-colors duration-300 group-hover:text-[#16a34a]/90 group-focus-within:text-[#16a34a]/90 motion-reduce:transition-none md:pt-0.5 md:text-[1.05rem]">
                    {phase.number}
                  </p>
                  <div className="min-w-0 max-w-[31rem]">
                    <h3 className="font-heading text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-white/96 group-focus-within:text-white/96 light:text-slate-900 light:group-hover:text-slate-950 motion-reduce:transition-none md:text-[1.45rem]">
                      {phase.title}
                    </h3>
                    <p className={`${bodyClass} mt-2.5 max-w-[29rem] text-slate-400/92 transition-colors duration-300 group-hover:text-slate-300 group-focus-within:text-slate-300 light:text-slate-600 light:group-hover:text-slate-700 motion-reduce:transition-none`}>
                      {phase.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

import SectionTitle from "@/components/common/SectionTitle";
import ProcessCard from "@/components/process/ProcessCard";
import { FadeIn } from "@/components/animations";
import { process } from "@/lib/data/process";

export default function Process() {
  return (
    <section id="process" className="below-fold relative overflow-hidden section-y">
      <div className="container relative">
        <FadeIn>
          <SectionTitle
            index="02"
            badge="Postopek"
            title="Kako poteka sodelovanje"
            description="Šest korakov. Po analizi dobite pisni obseg, pred produkcijo pa testno okolje."
          />
        </FadeIn>

        <ol className="relative max-w-2xl border-l border-white/[0.08] pl-8">
          <span
            className="absolute top-0 bottom-8 left-[-1px] w-px bg-gradient-to-b from-green-600/55 via-white/10 to-transparent"
            aria-hidden
          />
          {process.map((step, index) => (
            <li key={step.number}>
              <FadeIn delay={index * 0.06}>
                <ProcessCard
                  step={step.number}
                  title={step.title}
                  description={step.description}
                />
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

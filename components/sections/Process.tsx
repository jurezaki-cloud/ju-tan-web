import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import ProcessTimeline from "@/components/process/ProcessTimeline";
import { FadeIn } from "@/components/animations";

export default function Process() {
  return (
    <Section
      id="process"
      belowFold
      decorate={
        <div
          className="process-section-aurora pointer-events-none absolute left-1/2 top-1/2 h-[min(640px,80%)] w-[min(900px,92%)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          aria-hidden
        />
      }
    >
      <FadeIn>
        <SectionTitle
          align="center"
          className="mb-12"
          index="02"
          badge="Sodelovanje"
          title="Kako poteka sodelovanje"
          description="Šest korakov od analize do podpore. Po analizi dobite pisni obseg."
        />
      </FadeIn>
      <ProcessTimeline />
    </Section>
  );
}

import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import ServicesGrid from "@/components/services/ServicesGrid";

export default function Services() {
  return (
    <Section id="services" belowFold>
      <FadeIn>
        <SectionTitle
          align="center"
          index="01"
          badge="Storitve"
          title="Poslovna področja"
          description="Osem področij. Vsaka kartica: problem, rešitev, rezultat."
        />
      </FadeIn>
      <ServicesGrid />
    </Section>
  );
}

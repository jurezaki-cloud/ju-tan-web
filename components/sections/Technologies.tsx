import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import TechGrid from "@/components/tech/TechGrid";

export default function Technologies() {
  return (
    <Section id="technologies">
      <FadeIn>
        <SectionTitle
          align="center"
          index="03"
          badge="Tehnologije"
          title="Sklad, ki ga vzdržujemo"
          description="Orodja, s katerimi izvajamo in vzdržujemo produkcijo."
        />
      </FadeIn>
      <TechGrid />
    </Section>
  );
}

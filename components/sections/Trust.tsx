import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import InfoCard from "@/components/common/InfoCard";
import { trustItems } from "@/lib/data/trust";

export default function Trust() {
  return (
    <Section id="trust" belowFold>
      <SectionTitle
        align="center"
        badge="Pogoji sodelovanja"
        title="Kako je sistem zastavljen"
        description="Odločitve, ki ostanejo po uvedbi: koda, vmesniki in možnost rasti."
      />
      <ul className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {trustItems.map((item) => (
          <li key={item.title} className="h-full">
            <InfoCard icon={item.icon} title={item.title} text={item.text} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

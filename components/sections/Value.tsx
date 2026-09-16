import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import InfoCard from "@/components/common/InfoCard";
import { valueItems } from "@/lib/data/value";

export default function Value() {
  return (
    <Section id="value" belowFold>
      <SectionTitle
        align="center"
        badge="Zakaj JU-TAN"
        title="Zakaj podjetja izberejo JU-TAN"
        description="Poslovni sistemi po meri, povezani z obstoječimi orodji in z jasnim lastništvom kode."
      />
      <ul className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-2">
        {valueItems.map((item) => (
          <li key={item.title} className="h-full">
            <InfoCard icon={item.icon} title={item.title} text={item.text} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

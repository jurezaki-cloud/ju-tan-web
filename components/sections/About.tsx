import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import { company } from "@/lib/data/company";

export default function About() {
  return (
    <section id="about" className="below-fold relative overflow-hidden section-y">
      <div className="container relative overflow-x-hidden">
        <FadeIn>
          <SectionTitle
            index="05"
            badge="Zakaj JU-TAN"
            title="Majhna ekipa, produkcijski sistemi"
            description={company.headline}
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="max-w-2xl space-y-4 text-[16px] leading-[1.7] text-slate-400">
            <p>
              Delamo s slovenskimi podjetji, ki potrebujejo programsko opremo
              po meri — ne predlogo in ne neskončen workshop. Prvi stik je
              kratek klic, nato pisni obseg.
            </p>
            <p>
              Primeri v razdelku Reference so konceptualni, dokler stranka ne
              dovoli javne navedbe.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

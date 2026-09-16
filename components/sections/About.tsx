import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { bodyClass } from "@/design";

export default function About() {
  return (
    <Section
      id="about"
      belowFold
      innerClassName="flex flex-col items-center overflow-x-hidden text-center"
      decorate={
        <div
          className="about-ambient-glow pointer-events-none absolute left-1/2 top-[42%] h-[28rem] w-[min(42rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.28),transparent_68%)] blur-[64px]"
          aria-hidden
        />
      }
    >
      <div className="relative w-full max-w-[min(100%,21rem)] sm:max-w-[32rem] md:max-w-[760px]">
        <FadeIn>
          <SectionTitle
            align="center"
            className="mb-0"
            index="05"
            badge="Sodelovanje"
            title="Kako delamo"
            description="Partnerstvo od analize do vzdrževanja. Kakovost merimo z delujočim sistemom v produkciji, ne s predstavitvijo."
          />
        </FadeIn>

        <div className={`mx-auto mt-8 max-w-[40rem] space-y-4 ${bodyClass}`}>
          <FadeIn delay={0.08}>
            <p>
              Delamo kot dolgoročni partner: obseg je pisen, odločitve so
              zabeležene, koda ostane pri vas. Po uvedbi sledijo nadgradnje,
              ko se procesi v podjetju spremenijo.
            </p>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p>
              Sistemi so zastavljeni modularno, da jih je mogoče širiti. Primeri
              v razdelku Reference so tipi projektov, ne javne navedbe strank.
            </p>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

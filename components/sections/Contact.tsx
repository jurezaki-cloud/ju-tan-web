import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import ContactForm from "@/components/contact/ContactForm";
import { contactNextSteps } from "@/lib/data/contactNext";
import { surfacePanel, numberBadgeClass, headingCard, cardBodyClass } from "@/design";

export default function Contact() {
  return (
    <Section
      innerClassName="flex flex-col items-center justify-center overflow-x-hidden"
      decorate={
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent"
          aria-hidden
        />
      }
    >
      <div className="relative flex w-full flex-col items-center">
        <div
          className="contact-header-glow pointer-events-none absolute left-1/2 top-[7.5rem] h-[18rem] w-[min(36rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.22),transparent_70%)] blur-[64px]"
          aria-hidden
        />

        <FadeIn className="w-full max-w-[min(100%,21rem)] sm:max-w-[32rem] md:max-w-[720px]">
          <SectionTitle
            heading="h1"
            align="center"
            className="mb-0"
            index="07"
            badge="Kontakt"
            title="Pošljite povpraševanje"
            description="Opišite sistem, projekt ali poslovni izziv."
          />
        </FadeIn>

        <FadeIn delay={0.06} className="relative mt-8 w-full max-w-[min(100%,21rem)] sm:max-w-[32rem] md:max-w-[760px]">
          <div>
            <h2 className="mb-4 text-center font-heading text-[1.15rem] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
              Kaj sledi po oddaji?
            </h2>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {contactNextSteps.map((step) => (
                <li key={step.number} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 light:border-slate-200 light:bg-white">
                  <span className={numberBadgeClass}>{step.number}</span>
                  <div className="min-w-0">
                    <p className={headingCard}>{step.title}</p>
                    <p className={`mt-1 ${cardBodyClass}`}>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="relative mt-6 w-full max-w-[min(100%,21rem)] sm:max-w-[32rem] md:max-w-[760px]">
          <div className={surfacePanel}>
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,163,74,0.07),transparent_55%)]"
              aria-hidden
            />
            <div className="relative">
              <ContactForm />
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

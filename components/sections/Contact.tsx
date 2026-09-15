import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn, Reveal } from "@/components/animations";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="below-fold relative overflow-hidden section-y">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-[#08101f]" />

      <div className="container relative overflow-x-hidden">
        <FadeIn>
          <SectionTitle
            badge="Kontakt"
            title="Rezervirajte brezplačen posvet"
            description="Kratek pogovor nam omogoča, da pripravimo najboljšo AI rešitev za vaše podjetje."
          />
        </FadeIn>

        <div className="grid items-start gap-6 lg:grid-cols-5">
          <div className="min-w-0 lg:col-span-2">
            <Reveal>
              <ContactInfo />
            </Reveal>
          </div>

          <div className="min-w-0 lg:col-span-3">
            <Reveal delay={0.12}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

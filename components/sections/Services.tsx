import { services } from "@/lib/data/services";
import ServiceCard from "@/components/services/ServiceCard";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations";
import PremiumCTA from "@/components/common/PremiumCTA";

export default function Services() {
  return (
    <section id="services" className="below-fold relative overflow-hidden section-y">
      <div className="container relative">
        <FadeIn>
          <SectionTitle
            index="01"
            badge="Storitve"
            title="Kaj izdelamo"
            description="Šest področij. En postopek: analiza, izvedba, podpora."
          />
        </FadeIn>

        <Stagger className="max-w-3xl">
          {services.map((service, index) => (
            <StaggerItem key={service.title}>
              <ServiceCard
                index={String(index + 1).padStart(2, "0")}
                title={service.title}
                description={service.description}
                features={service.features}
              />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 max-w-3xl">
          <PremiumCTA
            heading="h2"
            title="Od dogovora do prve produkcijske različice v tednih."
            description="Povejte izziv. Pripravimo tehnični predlog, obseg in načrt izvedbe. Časovnica je odvisna od obsega."
            action="Pogovorimo se o projektu"
            aria-label="Pogovorimo se o projektu"
          />
        </div>
      </div>
    </section>
  );
}

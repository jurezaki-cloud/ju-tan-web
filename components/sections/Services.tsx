import { ArrowRight } from "lucide-react";
import { services } from "@/lib/services";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/cards/Card";

export default function Services() {
  return (
    <section id="services" className="bg-[#08101f] py-28 text-white">
      <Container>
        <SectionTitle
          badge="Naše storitve"
          title="Digitalne rešitve prihodnosti"
          description="JU-TAN združuje umetno inteligenco, razvoj programske opreme, spletne tehnologije in IT infrastrukturo v celovite poslovne rešitve."
        />

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card key={service.title}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-green-500/20 bg-green-500/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-green-500/20">
                    <Icon className="h-8 w-8 text-green-400" />
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-green-400">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-400">
                    {service.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 font-semibold text-green-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    Več informacij
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

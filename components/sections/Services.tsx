"use client";

import { services } from "@/lib/data/services";
import ServiceCard from "@/components/services/ServiceCard";
import SectionTitle from "@/components/common/SectionTitle";

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        <div className="container relative">

        <SectionTitle
          badge="SERVICES"
          title="Digital solutions powered by AI"
          description="JU-TAN develops premium software, AI automation and modern digital products."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {services.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}

        </div>

      </div>
    </section>
  );
}
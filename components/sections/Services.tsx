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
          badge="Storitve"
          title="Rešitve, ki pospešijo vaše poslovanje"
          description="JU-TAN razvija premium programsko opremo, umetno inteligenco in sodobne digitalne produkte za podjetja, ki želijo rasti hitreje."
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

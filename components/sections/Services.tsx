"use client";

import { services } from "@/lib/data/services";
import ServiceCard from "@/components/services/ServiceCard";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations";

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/12 blur-[160px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]
          [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
          [background-size:72px_72px]"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="container relative">
        <FadeIn>
          <SectionTitle
            badge="Storitve"
            title="Rešitve, ki pospešijo vaše poslovanje"
            description="JU-TAN razvija premium programsko opremo, umetno inteligenco in sodobne digitalne produkte za podjetja, ki želijo rasti hitreje."
          />
        </FadeIn>

        <Stagger className="mt-16 grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.title} className="h-full">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

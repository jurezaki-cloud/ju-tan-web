"use client";

import {
  Search,
  Lightbulb,
  Code2,
  Rocket,
} from "lucide-react";

import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Analiza",
    description:
      "Pregled poslovnih procesov, ciljev in priprava optimalne strategije.",
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "Načrtovanje",
    description:
      "Priprava arhitekture, UX, tehnologij in časovnega načrta projekta.",
  },
  {
    icon: Code2,
    number: "03",
    title: "Razvoj",
    description:
      "Razvoj AI rešitev, spletnih aplikacij in avtomatizacije po najvišjih standardih.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Implementacija",
    description:
      "Objava sistema, optimizacija, podpora in nadaljnji razvoj.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          badge="Postopek"
          title="Kako poteka sodelovanje"
          description="Od prve ideje do končne implementacije."
        />

        <Stagger className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <StaggerItem key={step.number}>
                <FadeIn>
                  <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-green-400/40 hover:bg-white/10">
                    <span className="absolute right-6 top-6 text-5xl font-black text-white/5">
                      {step.number}
                    </span>

                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 text-black">
                      <Icon size={30} />
                    </div>

                    <h3 className="mb-4 text-2xl font-bold">
                      {step.title}
                    </h3>

                    <p className="leading-7 text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

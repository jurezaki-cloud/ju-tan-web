"use client";

import {
  Bot,
  Cloud,
  Cpu,
  HeartHandshake,
  ShieldCheck,
  Workflow,
  ArrowRight,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import ServiceCard from "@/components/services/ServiceCard";
import ProcessCard from "@/components/process/ProcessCard";
import CTAButton from "@/components/navbar/CTAButton";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations";
import { process } from "@/lib/data/process";
import type { Service } from "@/lib/types";

const advantages: Service[] = [
  {
    icon: Bot,
    title: "AI rešitve",
    description:
      "AI agenti in inteligentni sistemi, ki pospešijo delo ekipe.",
    features: [
      "AI pomočniki po meri",
      "Avtomatizacija dokumentacije",
      "Integracija z obstoječimi orodji",
    ],
  },
  {
    icon: Cpu,
    title: "Razvoj po meri",
    description:
      "Programska oprema in spletne aplikacije, prilagojene vašemu poslovanju.",
    features: [
      "Stabilna arhitektura",
      "Sodobni tehnološki sklad",
      "Hitra nadgradnja",
    ],
  },
  {
    icon: Workflow,
    title: "Avtomatizacija procesov",
    description:
      "Povezujemo sisteme in poenostavimo ponavljajoče poslovne tokove.",
    features: [
      "Povezovanje API-jev",
      "Manj ročnega dela",
      "Nadzor in obvestila",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud infrastruktura",
    description:
      "Zanesljiva, razširljiva infrastruktura za nemoteno delovanje.",
    features: [
      "Oblak in Docker",
      "Visoka razpoložljivost",
      "Varnostne kopije",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Kibernetska varnost",
    description:
      "Zaščita podatkov, dostopov in poslovnih informacijskih sistemov.",
    features: [
      "Nadzor dostopov",
      "Pregled ranljivosti",
      "Varnostne politike",
    ],
  },
  {
    icon: HeartHandshake,
    title: "Dolgoročna podpora",
    description:
      "Projekt se ne konča z objavo – rastemo skupaj z vami.",
    features: [
      "Vzdrževanje sistemov",
      "Nadgradnje po meri",
      "Odzivna podpora",
    ],
  },
];

const buttonTransition =
  "transition-all duration-[250ms] ease-out hover:-translate-y-1 active:scale-[0.97]";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[160px]" />

      <div className="container relative overflow-x-hidden">
        <FadeIn>
          <SectionTitle
            badge="Zakaj JU-TAN"
            title="Tehnološki partner za rast vašega podjetja"
            description="Gradimo sodobne spletne rešitve, AI avtomatizacije in poslovne sisteme, ki so hitri, varni in pripravljeni na prihodnost."
          />
        </FadeIn>

        <Stagger className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {advantages.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <ServiceCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                features={item.features}
                showCta={false}
              />
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn delay={0.1}>
          <p className="mt-8 mb-4 text-center text-[14px] font-medium uppercase tracking-[0.18em] text-green-400">
            Način dela
          </p>
          <div className="relative">
            <div className="pointer-events-none absolute top-4 right-8 left-8 hidden h-px bg-gradient-to-r from-green-500/0 via-green-500/40 to-green-500/0 xl:block" />
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {process.map((step) => (
                <li key={step.number} className="min-w-0">
                  <ProcessCard
                    step={step.number}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                  />
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center shadow-xl shadow-black/20 backdrop-blur-xl">
            <h3 className="text-[28px] font-bold text-white">
              Pripravljeni na naslednji projekt?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-[16px] leading-[1.65] text-slate-400">
              Skupaj razvijmo rešitev, ki bo podprla rast vašega podjetja.
            </p>
            <div className="mt-6 flex justify-center">
              <CTAButton
                className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-500/50 ${buttonTransition}`}
              >
                Stopite v stik
                <ArrowRight className="h-5 w-5 transition-transform duration-[250ms] group-hover:translate-x-1" />
              </CTAButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

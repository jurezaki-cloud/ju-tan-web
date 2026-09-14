"use client";

import {
  Cpu,
  Database,
  Cloud,
  ShieldCheck,
  Bot,
  Code2,
} from "lucide-react";

import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";

const technologies = [
  {
    icon: Bot,
    title: "Umetna inteligenca",
    text: "OpenAI • LangChain • AI agenti",
  },
  {
    icon: Code2,
    title: "Razvoj",
    text: "Next.js • React • Python • Node.js",
  },
  {
    icon: Database,
    title: "Podatkovne zbirke",
    text: "PostgreSQL • MySQL • SQLite",
  },
  {
    icon: Cloud,
    title: "Oblak",
    text: "Docker • Linux • VPS • Cloudflare",
  },
  {
    icon: ShieldCheck,
    title: "Kibernetska varnost",
    text: "Firewall • Backup • Monitoring",
  },
  {
    icon: Cpu,
    title: "Infrastruktura",
    text: "Omrežja • strežniki • virtualizacija",
  },
];

export default function Technologies() {
  return (
    <section id="technologies" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="container relative">
        <FadeIn>
          <SectionTitle
            badge="Tehnologije"
            title="Tehnologije, ki jim zaupamo"
            description="Gradimo moderne, hitre in varne rešitve."
          />
        </FadeIn>

        <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {technologies.map((item) => {
            const Icon = item.icon;

            return (
              <FadeIn key={item.title} className="h-full">
                <div className="flex h-full min-h-[200px] w-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10 backdrop-blur-xl transition duration-[250ms] hover:-translate-y-1 hover:scale-[1.02] hover:border-green-400/40 hover:shadow-[0_20px_50px_rgba(34,197,94,0.18)]">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 text-black">
                    <Icon size={28} />
                  </div>

                  <h3 className="mb-1 text-[28px] font-bold leading-tight text-white">
                    {item.title}
                  </h3>

                  <p className="text-[16px] leading-[1.65] text-slate-400">
                    {item.text}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

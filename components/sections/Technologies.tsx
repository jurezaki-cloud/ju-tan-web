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
    <section
      id="technologies"
      className="py-20"
    >
      <div className="container relative">
        <SectionTitle
          badge="Tehnologije"
          title="Tehnologije, ki jim zaupamo"
          description="Gradimo moderne, hitre in varne rešitve."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {technologies.map((item) => {
            const Icon = item.icon;

            return (
              <FadeIn key={item.title}>
                <div className="mx-auto flex h-[200px] w-full max-w-[360px] flex-col rounded-[22px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-[250ms] hover:-translate-y-1 hover:scale-[1.02] hover:border-green-500/40">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 text-black">
                    <Icon size={28} />
                  </div>

                  <h3 className="mb-1 text-[28px] font-bold leading-tight">
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

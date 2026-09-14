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
      className="py-16 md:py-20"
    >
      <div className="container relative">
        <SectionTitle
          badge="Tehnologije"
          title="Tehnologije, ki jim zaupamo"
          description="Gradimo moderne, hitre in varne rešitve."
        />

        <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 md:mt-8 xl:grid-cols-3">
          {technologies.map((item) => {
            const Icon = item.icon;

            return (
              <FadeIn key={item.title}>
                <div className="mx-auto flex h-[180px] max-w-[320px] flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-green-500/40">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 text-black">
                    <Icon size={22} />
                  </div>

                  <h3 className="mb-1 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="text-[16px] leading-[1.6] text-slate-400">
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

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
    title: "Artificial Intelligence",
    text: "OpenAI • LangChain • AI Agents",
  },
  {
    icon: Code2,
    title: "Development",
    text: "Next.js • React • Python • Node.js",
  },
  {
    icon: Database,
    title: "Databases",
    text: "PostgreSQL • MySQL • SQLite",
  },
  {
    icon: Cloud,
    title: "Cloud",
    text: "Docker • Linux • VPS • Cloudflare",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    text: "Firewall • Backup • Monitoring",
  },
  {
    icon: Cpu,
    title: "Infrastructure",
    text: "Networking • Servers • Virtualization",
  },
];

export default function Technologies() {
  return (
    <section
      id="technologies"
      className="py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        <SectionTitle
          eyebrow="TECHNOLOGIES"
          title="Tehnologije, ki jim zaupamo"
          description="Gradimo moderne, hitre in varne rešitve."
        />

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {technologies.map((item) => {
            const Icon = item.icon;

            return (
              <FadeIn key={item.title}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-green-500/40">

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 text-black">
                    <Icon size={30} />
                  </div>

                  <h3 className="mb-3 text-2xl font-bold">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 leading-7">
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
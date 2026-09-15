import {
  Database,
  Cloud,
  ShieldCheck,
  Bot,
  Code2,
  Server,
} from "lucide-react";

import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import SectionCta from "@/components/common/SectionCta";
import type { Technology } from "@/lib/types";

const technologies: readonly Technology[] = [
  {
    icon: Code2,
    title: "Frontend",
    text: "Next.js • React • Tailwind",
  },
  {
    icon: Server,
    title: "Backend",
    text: "Node.js • Python • API integracije",
  },
  {
    icon: Bot,
    title: "AI",
    text: "OpenAI • LangChain • AI agenti",
  },
  {
    icon: Cloud,
    title: "Cloud",
    text: "Docker • Linux • VPS • Cloudflare",
  },
  {
    icon: Database,
    title: "Database",
    text: "PostgreSQL • MySQL • SQLite",
  },
  {
    icon: ShieldCheck,
    title: "DevOps",
    text: "CI/CD • monitoring • varnostne kopije",
  },
];

export default function Technologies() {
  return (
    <section id="technologies" className="below-fold relative overflow-hidden section-y">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="container relative">
        <FadeIn>
          <SectionTitle
            badge="Tehnologije"
            title="Tehnologije, ki jim zaupamo"
            description="Gradimo moderne, hitre in varne rešitve."
          />
        </FadeIn>

        <div className="grid auto-rows-fr items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {technologies.map((item) => {
            const Icon = item.icon;

            return (
              <FadeIn key={item.title} className="h-full">
                <div className="surface-card flex h-full min-h-[200px] w-full flex-col p-6 transition duration-[250ms] hover:-translate-y-2 hover:border-green-400/40 hover:shadow-card-hover">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-green-500 to-emerald-400 text-black">
                    <Icon size={28} aria-hidden />
                  </div>

                  <h3 className="heading-3 mb-1 text-white">{item.title}</h3>

                  <p className="mt-auto pt-2 text-[16px] leading-[1.65] text-slate-400">
                    {item.text}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <SectionCta />
      </div>
    </section>
  );
}

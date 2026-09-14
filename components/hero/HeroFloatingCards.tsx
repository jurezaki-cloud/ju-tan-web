"use client";

import { motion } from "framer-motion";
import { Bot, Cloud, Cpu, ShieldCheck, Workflow } from "lucide-react";

const cards = [
  {
    icon: Bot,
    title: "AI Agent",
    subtitle: "24/7 avtomatizacija",
    position: "left-0 top-10",
  },
  {
    icon: Workflow,
    title: "Automation",
    subtitle: "Pametni procesi",
    position: "right-0 top-24",
  },
  {
    icon: Cloud,
    title: "Cloud",
    subtitle: "Visoka razpoložljivost",
    position: "bottom-20 left-10",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    subtitle: "Enterprise Ready",
    position: "bottom-10 right-10",
  },
  {
    icon: Cpu,
    title: "Software",
    subtitle: "Custom Development",
    position: "left-1/2 top-0 -translate-x-1/2",
  },
];

export default function FloatingCards() {
  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4 + index * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-2xl backdrop-blur-xl sm:block ${card.position}`}
          >
            <div className="mb-2 text-green-400">
              <Icon size={24} />
            </div>
            <h3 className="font-semibold text-white">{card.title}</h3>
            <p className="text-sm text-gray-400">{card.subtitle}</p>
          </motion.div>
        );
      })}
    </>
  );
}

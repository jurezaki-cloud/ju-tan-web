"use client";

import { motion } from "framer-motion";
import { Bot, Cloud, Cpu, ShieldCheck, Workflow } from "lucide-react";

const cards = [
  {
    icon: Cpu,
    title: "Software",
    subtitle: "Custom Development",
    position: "left-1/2 top-0 -translate-x-1/2",
  },
  {
    icon: Bot,
    title: "AI Agent",
    subtitle: "24/7 avtomatizacija",
    position: "left-0 top-[28%]",
  },
  {
    icon: Workflow,
    title: "Automation",
    subtitle: "Pametni procesi",
    position: "right-0 top-[28%]",
  },
  {
    icon: Cloud,
    title: "Cloud",
    subtitle: "Visoka razpoložljivost",
    position: "bottom-[6%] left-0",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    subtitle: "Enterprise Ready",
    position: "bottom-[6%] right-0",
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
            animate={{ y: [0, -10, 0] }}
            whileHover={{ scale: 1.06 }}
            transition={{
              y: {
                duration: 4.5 + index * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: { duration: 0.3 },
            }}
            className={`glass absolute hidden cursor-default rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-xl sm:block ${card.position}`}
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

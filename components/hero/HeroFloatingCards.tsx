"use client";

import { motion } from "framer-motion";
import { Bot, Cloud, ShieldCheck } from "lucide-react";

const cards = [
  {
    icon: Bot,
    title: "AI Automation",
    subtitle: "Workflow Active",
    position: "left-0 top-16 lg:-left-10",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    subtitle: "99.99% Uptime",
    position: "right-0 top-0 lg:-right-8",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    subtitle: "Protected",
    position: "right-8 bottom-8",
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
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute hidden lg:flex ${card.position}
              glass
              items-center
              gap-4
              rounded-2xl
              px-5
              py-4
              shadow-xl`}
          >
            <div className="rounded-xl bg-green-500/15 p-3">
              <Icon className="h-6 w-6 text-green-400" />
            </div>

            <div>
              <p className="font-semibold text-white">
                {card.title}
              </p>

              <p className="text-sm text-slate-400">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}
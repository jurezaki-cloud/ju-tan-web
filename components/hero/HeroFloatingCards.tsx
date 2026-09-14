"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

function subscribeDesktop(onStoreChange: () => void) {
  const media = window.matchMedia("(min-width: 640px)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function desktopSnapshot() {
  return window.matchMedia("(min-width: 640px)").matches;
}

export default function FloatingCards() {
  const reduceMotion = useReducedMotion();
  const show = useSyncExternalStore(subscribeDesktop, desktopSnapshot, () => false);

  if (!show) return null;

  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
            whileHover={{ scale: 1.02 }}
            transition={{
              y: {
                duration: 6 + index * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: { duration: 0.25 },
            }}
            className={`glass absolute cursor-default rounded-2xl border border-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-[250ms] hover:border-green-400/40 hover:shadow-[0_16px_40px_rgba(34,197,94,0.18)] ${card.position}`}
          >
            <div className="mb-1 text-green-400">
              <Icon size={16} />
            </div>
            <h3 className="text-[14px] font-semibold leading-tight text-white">
              {card.title}
            </h3>
            <p className="text-[12px] text-gray-400">{card.subtitle}</p>
          </motion.div>
        );
      })}
    </>
  );
}

"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import ServiceIcon from "./ServiceIcon";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  features = [],
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group h-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-green-400/40 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(34,197,94,0.18)]"
    >
      <ServiceIcon>
        <Icon size={36} />
      </ServiceIcon>

      <h3 className="mb-3 text-2xl font-bold text-white">{title}</h3>

      <p className="leading-8 text-slate-400">{description}</p>

      {features.length > 0 ? (
        <ul className="mt-6 space-y-2.5">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm leading-6 text-slate-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      <a
        href="#contact"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-green-400 transition-all duration-300 hover:gap-3 hover:text-green-300"
      >
        Več informacij
        <ArrowRight className="h-4 w-4" />
      </a>
    </motion.div>
  );
}

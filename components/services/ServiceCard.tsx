"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import ServiceIcon from "./ServiceIcon";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  showCta?: boolean;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  features = [],
  showCta = true,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex h-full min-h-[240px] flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-[250ms] hover:border-green-400/40 hover:bg-white/[0.07] hover:shadow-[0_20px_50px_rgba(34,197,94,0.18)]"
    >
      <ServiceIcon>
        <Icon size={28} />
      </ServiceIcon>

      <h3 className="mb-1.5 text-[28px] font-bold leading-tight text-white">
        {title}
      </h3>

      <p className="line-clamp-3 text-[16px] leading-[1.65] text-slate-400">
        {description}
      </p>

      {features.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-[14px] leading-5 text-slate-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      {showCta ? (
        <a
          href="#contact"
          className="mt-auto inline-flex items-center gap-2 rounded-sm pt-3 text-[14px] font-semibold text-green-400 transition-all duration-[250ms] hover:gap-3 hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          Več informacij
          <ArrowRight className="h-4 w-4" />
        </a>
      ) : (
        <div className="mt-auto" />
      )}
    </motion.div>
  );
}

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
    <motion.article
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10 backdrop-blur-xl transition duration-[250ms] hover:border-green-400/45 hover:bg-white/[0.07] hover:shadow-[0_22px_55px_rgba(34,197,94,0.2)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent opacity-0 transition duration-[250ms] group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-500/10 blur-3xl opacity-0 transition duration-[250ms] group-hover:opacity-100" />

      <ServiceIcon>
        <Icon size={28} />
      </ServiceIcon>

      <h3 className="mb-2 font-heading text-[26px] font-semibold leading-tight tracking-[-0.03em] text-white">
        {title}
      </h3>

      <p className="line-clamp-3 text-[15px] leading-[1.7] text-slate-400">
        {description}
      </p>

      {features.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
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
          className="mt-auto inline-flex items-center gap-2 rounded-sm pt-4 text-[14px] font-semibold text-green-400 transition-all duration-[250ms] hover:gap-3 hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          Več informacij
          <ArrowRight className="h-4 w-4" />
        </a>
      ) : (
        <div className="mt-auto" />
      )}
    </motion.article>
  );
}

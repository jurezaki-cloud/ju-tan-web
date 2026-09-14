"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  step: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function ProcessCard({
  step,
  title,
  description,
  icon: Icon,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/5 p-2.5 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-[250ms] hover:border-green-400/40 hover:shadow-[0_20px_50px_rgba(34,197,94,0.18)]"
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-lg font-black leading-none text-green-500">
          {step}
        </div>
        {Icon ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/10 text-green-400">
            <Icon size={12} />
          </div>
        ) : null}
      </div>

      <h3 className="mb-0.5 text-[16px] font-bold text-white">{title}</h3>

      <p className="text-[14px] leading-[1.6] text-slate-400">{description}</p>
    </motion.div>
  );
}

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
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-green-400/40 hover:shadow-[0_16px_40px_rgba(34,197,94,0.16)]"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xl font-black leading-none text-emerald-500">
          {step}
        </div>
        {Icon ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Icon size={14} />
          </div>
        ) : null}
      </div>

      <h3 className="mb-1 text-base font-bold text-white">{title}</h3>

      <p className="text-sm leading-[1.6] text-slate-400">{description}</p>
    </motion.div>
  );
}

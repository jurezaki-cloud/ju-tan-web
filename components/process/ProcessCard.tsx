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
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-green-400/40 hover:shadow-[0_20px_60px_rgba(34,197,94,0.16)]"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="text-5xl font-black text-emerald-500">{step}</div>
        {Icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Icon size={24} />
          </div>
        ) : null}
      </div>

      <h3 className="mb-3 text-2xl font-bold text-white">{title}</h3>

      <p className="leading-7 text-slate-400">{description}</p>
    </motion.div>
  );
}

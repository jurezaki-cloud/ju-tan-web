"use client";

import { motion } from "framer-motion";

interface Props {
  step: string;
  title: string;
  description: string;
}

export default function ProcessCard({
  step,
  title,
  description,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: .25 }}
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-8
        backdrop-blur-xl
      "
    >
      <div className="mb-5 text-5xl font-black text-emerald-500">
        {step}
      </div>

      <h3 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="leading-7 text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}
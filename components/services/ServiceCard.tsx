"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import ServiceIcon from "./ServiceIcon";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{ duration: 0.25 }}
      className="
      group
      rounded-3xl
      border border-white/10
      bg-white/[0.03]
      p-8
      backdrop-blur-xl
      transition-all
      hover:border-emerald-500/40
      hover:bg-white/[0.05]
      "
    >
      <ServiceIcon>
        <Icon size={30} />
      </ServiceIcon>

      <h3 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="leading-8 text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}

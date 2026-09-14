"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { company } from "@/lib/data/company";

export default function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3.5 py-1.5 text-sm font-medium text-green-400 shadow-[0_0_24px_rgba(34,197,94,0.12)] backdrop-blur-md"
    >
      <motion.span
        animate={{ rotate: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex"
      >
        <Sparkles className="h-4 w-4" />
      </motion.span>
      {company.badge}
    </motion.div>
  );
}

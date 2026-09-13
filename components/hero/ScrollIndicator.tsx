"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      animate={{ y: [0, 10, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      <a
        href="#services"
        className="flex flex-col items-center text-slate-400 transition hover:text-green-400"
      >
        <span className="mb-2 text-xs uppercase tracking-[0.3em]">
          Scroll
        </span>

        <ChevronDown className="h-6 w-6" />
      </a>
    </motion.div>
  );
}
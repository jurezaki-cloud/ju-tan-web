"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
      animate={{ y: [0, 8, 0], opacity: [0.55, 1, 0.55] }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <a
        href="#services"
        aria-label="Pomakni se na storitve"
        className="flex flex-col items-center rounded-sm text-slate-400 transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        <span className="mb-2 text-xs uppercase tracking-[0.3em]">
          Pomakni se
        </span>

        <ChevronDown className="h-6 w-6" />
      </a>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ServiceIcon({ children }: Props) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      whileHover={{ scale: 1.08, rotate: -4 }}
      transition={{
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.25 },
        rotate: { duration: 0.25 },
      }}
      className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/20 bg-gradient-to-br from-green-500/20 to-emerald-500/5 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.16)]"
    >
      {children}
    </motion.div>
  );
}

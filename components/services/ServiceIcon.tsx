"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function ServiceIcon({ children }: Props) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      whileHover={{ scale: 1.06 }}
      transition={{
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.25 },
      }}
      className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.12)]"
    >
      {children}
    </motion.div>
  );
}

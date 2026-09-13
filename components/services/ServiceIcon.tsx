"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function ServiceIcon({ children }: Props) {
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        rotate: 6,
      }}
      transition={{ duration: 0.25 }}
      className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400"
    >
      {children}
    </motion.div>
  );
}
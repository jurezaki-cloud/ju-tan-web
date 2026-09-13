"use client";

import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">

      <div className="absolute inset-0 bg-[#050816]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f172a,transparent_70%)]" />

      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[-200px]
          top-[80px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-emerald-500/15
          blur-[140px]
        "
      />

      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[-200px]
          bottom-[-100px]
          h-[600px]
          w-[600px]
          rounded-full
          bg-green-400/10
          blur-[160px]
        "
      />
    </div>
  );
}
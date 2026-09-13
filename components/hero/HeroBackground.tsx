"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      {/* Glavni zeleni glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-24 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-green-500/20 blur-[180px]"
      />

      {/* Modri glow */}
      <motion.div
        animate={{
          x: [-30, 30, -30],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]"
      />

      {/* Vijolični glow */}
      <motion.div
        animate={{
          x: [30, -30, 30],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[180px]"
      />

      {/* Grid */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
          [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />
    </div>
  );
}
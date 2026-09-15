"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function HeroReveal({
  children,
  className,
  delay = 0,
}: HeroRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.45,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

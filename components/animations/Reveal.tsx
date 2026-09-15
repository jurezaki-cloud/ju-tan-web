"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { duration, easeOut } from "@/design";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
};

const variants = {
  up: { x: 0, y: 10 },
  down: { x: 0, y: -10 },
  left: { x: 10, y: 0 },
  right: { x: -10, y: 0 },
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
}: RevealProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, ...variants[direction] }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0.01 : duration.base,
        delay: reduceMotion ? 0 : delay,
        ease: easeOut,
      }}
    >
      {children}
    </motion.div>
  );
}

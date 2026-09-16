"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { duration, easeOut } from "@/design";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
};

export default function FadeIn({
  children,
  delay = 0,
  duration: durationProp = duration.reveal,
  y = 12,
  once = true,
  className,
}: FadeInProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once,
        amount: 0.2,
      }}
      transition={{
        duration: reduceMotion ? 0.01 : durationProp,
        delay: reduceMotion ? 0 : delay,
        ease: easeOut,
      }}
    >
      {children}
    </motion.div>
  );
}

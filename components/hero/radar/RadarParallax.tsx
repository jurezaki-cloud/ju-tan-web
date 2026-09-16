"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

type RadarParallaxProps = {
  children: ReactNode;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  amount: number;
  reduce: boolean;
};

export default function RadarParallax({
  children,
  pointerX,
  pointerY,
  amount,
  reduce,
}: RadarParallaxProps) {
  const x = useTransform(pointerX, (value) => value * amount);
  const y = useTransform(pointerY, (value) => value * amount);

  if (reduce) return children;

  return (
    <motion.div className="absolute inset-0 will-change-transform" style={{ x, y }}>
      {children}
    </motion.div>
  );
}

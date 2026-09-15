"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">;

export default function StaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0.01 : 0.5, ease: "easeOut" },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

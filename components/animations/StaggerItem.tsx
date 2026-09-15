"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { duration, easeOut } from "@/design";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">;

export default function StaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reduceMotion ? 0.01 : duration.base,
            ease: easeOut,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./HeroReveal.module.css";

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * CSS-only hero entrance: the wrapper does not need a client component.
 * Keep the existing timing and reduced-motion behavior.
 */
export default function HeroReveal({
  children,
  className,
  delay = 0,
}: HeroRevealProps) {
  return (
    <div
      className={cn(styles.enter, className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

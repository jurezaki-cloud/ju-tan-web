import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./HeroReveal.module.css";

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

// CSS-only entrance animation: keep hero copy server-rendered and avoid
// adding a client hydration boundary to the above-the-fold content.
export default function HeroReveal({
  children,
  className,
  delay = 0,
}: HeroRevealProps) {
  return (
    <div
      className={cn(styles.reveal, className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

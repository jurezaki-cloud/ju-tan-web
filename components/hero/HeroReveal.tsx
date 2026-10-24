import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  return (
    <div
      className={cn("content-reveal", className)}
      style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

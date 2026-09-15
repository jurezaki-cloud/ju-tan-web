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
      className={cn("hero-enter", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

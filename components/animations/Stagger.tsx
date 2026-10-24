import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type StaggerProps = {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
};

export default function Stagger({
  children,
  delay = 0,
  stagger = 0.08,
  className,
}: StaggerProps) {
  const style = {
    "--stagger-delay": `${delay}s`,
    "--stagger-step": `${stagger}s`,
  } as CSSProperties;

  return (
    <div className={cn("stagger-group", className)} style={style}>
      {children}
    </div>
  );
}

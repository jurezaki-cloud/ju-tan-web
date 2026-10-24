import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
};

/**
 * Server-rendered reveal. Opacity stays high enough to paint immediately,
 * so the largest text is not held until a client animation library hydrates.
 */
export default function FadeIn({
  children,
  delay = 0,
  duration: durationProp,
  className,
}: FadeInProps) {
  const style: CSSProperties = {};
  if (delay > 0) style.animationDelay = `${delay}s`;
  if (durationProp) style.animationDuration = `${durationProp}s`;

  return (
    <div className={cn("content-reveal", className)} style={style}>
      {children}
    </div>
  );
}

"use client";

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
    <>
      <div
        className={cn("hero-reveal-enter", className)}
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes hero-reveal-enter {
          from {
            opacity: 0.72;
            transform: translate3d(0, 6px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .hero-reveal-enter {
          animation: hero-reveal-enter 0.34s var(--ease-premium) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-reveal-enter {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

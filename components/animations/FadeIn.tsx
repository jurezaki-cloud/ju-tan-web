"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { duration } from "@/design";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
};

// A native observer + CSS transition avoids hydrating Framer Motion on every
// marketing section. Keep the same public API and reduced-motion behaviour.
export default function FadeIn({
  children,
  delay = 0,
  duration: durationProp = duration.reveal,
  y = 12,
  once = true,
  className,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
      setVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [once]);

  const shown = visible || reduceMotion;
  const transition = reduceMotion
    ? "none"
    : `opacity ${durationProp}s ease-out ${delay}s, transform ${durationProp}s ease-out ${delay}s`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0, 0, 0)" : `translate3d(0, ${y}px, 0)`,
        transition,
      }}
    >
      {children}
    </div>
  );
}

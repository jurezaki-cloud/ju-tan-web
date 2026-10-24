import type { ReactNode } from "react";

type RadarParallaxProps = {
  children: ReactNode;
  amount?: number;
  reduce: boolean;
};

export default function RadarParallax({
  children,
  reduce,
}: RadarParallaxProps) {
  if (reduce) return children;

  return (
    <div className="radar-parallax absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}

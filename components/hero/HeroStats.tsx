"use client";

import { FadeIn } from "@/components/animations";
import { stats } from "@/lib/data/stats";
export default function HeroStats() {
  return (
    <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <FadeIn key={stat.label} delay={0.2 + index * 0.2}>
          <div className="glass rounded-3xl p-8 text-center">
            <div className="text-4xl font-bold text-green-400">
              {stat.value}
            </div>

            <p className="mt-3 text-sm text-slate-400">
              {stat.label}
            </p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

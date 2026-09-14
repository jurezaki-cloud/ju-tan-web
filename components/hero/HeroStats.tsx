"use client";

import { FadeIn } from "@/components/animations";
import { stats } from "@/lib/data/stats";

export default function HeroStats() {
  return (
    <div className="mt-5 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <FadeIn key={stat.label} delay={0.2 + index * 0.1}>
          <div className="glass rounded-2xl p-4 shadow-lg shadow-green-500/5">
            <div className="text-3xl font-black text-green-500">{stat.value}</div>
            <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

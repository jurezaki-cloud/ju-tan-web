"use client";

import { FadeIn } from "@/components/animations";
import { stats } from "@/lib/data/stats";

export default function HeroStats() {
  return (
    <div className="mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
      {stats.map((stat, index) => (
        <FadeIn key={stat.label} delay={0.2 + index * 0.1}>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="text-4xl font-black text-green-500">{stat.value}</div>
            <p className="mt-2 text-gray-400">{stat.label}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

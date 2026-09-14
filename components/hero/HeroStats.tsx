import { FadeIn } from "@/components/animations";
import { stats } from "@/lib/data/stats";

export default function HeroStats() {
  return (
    <div className="mt-5 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <FadeIn key={stat.label} delay={0.2 + index * 0.1}>
          <div className="glass flex h-24 flex-col justify-center rounded-[22px] px-4 py-3 shadow-lg shadow-green-500/5">
            <div className="text-[28px] font-black leading-none text-green-500">
              {stat.value}
            </div>
            <p className="mt-1 text-[14px] text-gray-400">{stat.label}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

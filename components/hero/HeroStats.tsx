import { stats } from "@/lib/data/stats";

export default function HeroStats() {
  return (
    <div className="mt-7 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass flex h-[5.5rem] flex-col justify-center rounded-2xl border border-white/10 px-4 py-3 shadow-lg shadow-green-500/10 transition duration-[250ms] hover:border-green-400/30 hover:shadow-[0_16px_40px_rgba(34,197,94,0.16)]"
        >
          <div className="font-heading text-[30px] font-semibold leading-none tracking-[-0.04em] text-green-400">
            {stat.value}
          </div>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-400">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

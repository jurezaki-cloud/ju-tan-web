export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050816] light:bg-slate-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,8,22,0.16),rgba(5,8,22,0.72))] light:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(248,250,252,0.96))]" />
      <div className="absolute inset-0 opacity-[0.06] light:opacity-[0.035]" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.28) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute -left-[8%] top-[4%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.09),transparent_70%)] opacity-35 blur-[74px] light:opacity-15" />
      <div className="absolute right-[8%] top-[13%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.08),transparent_68%)] opacity-35 blur-[88px] light:opacity-15" />
      <div className="absolute left-1/2 top-0 h-px w-[min(72rem,100%)] -translate-x-1/2 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.14),transparent)] light:bg-[linear-gradient(to_right,transparent,rgba(15,23,42,0.12),transparent)]" />
      <div className="absolute left-[10%] top-[22%] h-[8rem] w-px bg-[linear-gradient(to_bottom,rgba(22,163,74,0),rgba(22,163,74,0.18),rgba(22,163,74,0))]" />
      <div className="absolute right-[18%] top-[15%] h-[14rem] w-px bg-[linear-gradient(to_bottom,rgba(22,163,74,0),rgba(22,163,74,0.14),rgba(22,163,74,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_54%_50%_at_72%_45%,rgba(22,163,74,0.05),transparent_64%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_38%_at_16%_18%,rgba(15,23,42,0.72),transparent_60%)] light:opacity-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_56%,rgba(0,0,0,0.34)_100%)] light:opacity-0" />
    </div>
  );
}

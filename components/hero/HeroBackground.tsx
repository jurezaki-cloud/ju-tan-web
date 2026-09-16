export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050816] light:bg-slate-50" />
      <div className="aurora-orb-a absolute -left-[12%] top-[6%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.1),transparent_70%)] opacity-40 blur-[64px] light:opacity-25" />
      <div className="aurora-orb-b absolute -right-[10%] top-[22%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.07),transparent_72%)] opacity-30 blur-[72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_46%_at_78%_48%,rgba(22,163,74,0.08),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_36%_32%_at_12%_22%,rgba(15,23,42,0.65),transparent_58%)] light:opacity-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(0,0,0,0.28)_100%)] light:opacity-0" />
    </div>
  );
}

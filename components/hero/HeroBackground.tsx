export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050816]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(34,197,94,0.16),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#10253a,transparent_62%)]" />

      <div className="aurora-orb-a absolute top-[72px] left-[-180px] h-[520px] w-[520px] rounded-full bg-emerald-500/16 blur-[150px]" />
      <div className="aurora-orb-b absolute right-[-220px] bottom-[-80px] h-[620px] w-[620px] rounded-full bg-green-400/12 blur-[170px]" />

      <div className="hero-orb-a absolute top-16 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-green-500/18 blur-[190px]" />
      <div className="hero-orb-b absolute top-28 right-[6%] h-[260px] w-[260px] rounded-full bg-emerald-400/16 blur-[110px]" />

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

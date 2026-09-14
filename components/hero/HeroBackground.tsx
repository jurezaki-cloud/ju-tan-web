export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="hero-orb-a absolute top-16 left-1/2 h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-green-500/22 blur-[200px]" />

      <div className="hero-orb-b absolute top-36 right-[4%] h-[280px] w-[280px] rounded-full bg-cyan-400/12 blur-[120px]" />

      <div
        className="absolute inset-0 opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
          [background-size:72px_72px]"
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

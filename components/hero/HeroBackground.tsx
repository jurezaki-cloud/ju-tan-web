export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="hero-orb-a absolute top-16 left-1/2 h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-green-500/26 blur-[200px]" />

      <div className="hero-orb-b absolute top-36 right-[4%] h-[280px] w-[280px] rounded-full bg-emerald-400/14 blur-[120px]" />

      <div className="hero-volume pointer-events-none absolute top-[18%] right-[8%] h-[520px] w-[380px] rounded-full bg-green-400/10 blur-[90px]" />

      <div className="hero-volume-cone pointer-events-none absolute top-[8%] left-1/2 h-[70%] w-[min(42rem,90%)] -translate-x-1/2 opacity-80" />

      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/12 blur-[110px]" />

      <div
        className="absolute inset-0 opacity-[0.045]
          [background-image:linear-gradient(rgba(148,163,184,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.22)_1px,transparent_1px)]
          [background-size:64px_64px]"
      />
    </div>
  );
}

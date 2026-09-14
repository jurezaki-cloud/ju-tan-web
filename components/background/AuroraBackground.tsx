export default function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050816]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f172a,transparent_70%)]" />

      <div
        className="aurora-orb-a absolute top-[80px] left-[-200px] h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[140px]"
      />

      <div
        className="aurora-orb-b absolute right-[-200px] bottom-[-100px] h-[600px] w-[600px] rounded-full bg-green-400/10 blur-[160px]"
      />
    </div>
  );
}

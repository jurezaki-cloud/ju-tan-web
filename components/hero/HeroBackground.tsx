export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050816]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_46%_at_78%_48%,rgba(22,163,74,0.11),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_36%_32%_at_12%_22%,rgba(15,23,42,0.7),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(0,0,0,0.34)_100%)]" />
    </div>
  );
}

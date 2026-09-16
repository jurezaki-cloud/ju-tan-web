/** Shared interaction classes — hover 220ms, ease-out, transform/opacity/filter only. */
export const durationHover = "duration-hover ease-out";

export const hoverTransition =
  `transition-[transform,border-color,box-shadow,opacity,filter,background-color,color] ${durationHover}`;

export const colorTransition = `transition-colors ${durationHover}`;

export const cardSurface =
  "rounded-card border border-white/10 bg-white/[0.03] light:border-slate-200/80 light:bg-white/70";

export const cardHover =
  `${hoverTransition} hover:-translate-y-1 hover:border-[#16a34a]/45`;

export const cardBase = `group relative overflow-hidden p-6 ${cardSurface} ${cardHover}`;

export const cardIcon =
  "flex h-12 w-12 shrink-0 items-center justify-center text-[#16a34a]";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600";

export const btnHover =
  `${hoverTransition} hover:-translate-y-px [&_svg]:transition-transform [&_svg]:duration-hover [&_svg]:ease-out group-hover:[&_svg]:translate-x-0.5`;

export const iconButtonClass = [
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
  colorTransition,
  focusRing,
].join(" ");

export const textLinkClass = [
  "inline-flex min-h-11 items-center font-medium text-[#16a34a] underline-offset-4",
  colorTransition,
  "hover:text-white hover:underline",
  focusRing,
].join(" ");

export const insetSurface =
  "rounded-xl border border-white/8 bg-white/[0.02] px-4 py-4 light:border-slate-200 light:bg-white/60";

export const noteSurface =
  "rounded-xl border border-[#16a34a]/20 bg-[#16a34a]/8 px-4 py-3 text-[14px] leading-[1.7] text-slate-300 light:border-[#16a34a]/25 light:bg-[#16a34a]/8 light:text-slate-700";

export const kickerClass =
  "flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400";

export const bodyClass =
  "text-[16px] leading-[1.7] tracking-[-0.011em] text-slate-400 md:text-[17px]";

export const ledeClass =
  "text-[15px] leading-[1.65] tracking-[-0.011em] text-slate-400 light:text-slate-600";

export const headingCard =
  "font-heading text-[18px] font-semibold tracking-[-0.03em] text-white light:text-slate-900";

export const cardBodyClass = "text-[14px] leading-[1.55] text-slate-400";

export const metaClass = "text-[12px] tracking-[0.02em] text-slate-500";

export const fieldClass =
  `h-11 w-full rounded-lg border border-white/10 bg-transparent px-4 text-[16px] text-white shadow-none outline-none transition-[border-color,box-shadow] ${durationHover} placeholder:text-slate-500 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-green-600 aria-invalid:border-red-400 aria-invalid:ring-1 aria-invalid:ring-red-400/40 md:text-[16px] light:border-slate-200 light:bg-white light:text-slate-900`;

export const labelClass =
  "mb-1.5 block text-[14px] font-medium text-slate-300 light:text-slate-700";

export const surfacePanel =
  "relative overflow-hidden rounded-card border border-white/10 bg-white/[0.04] p-6 sm:p-10 md:p-12 light:border-slate-200/80 light:bg-white/70";

export const surfacePanelCompact =
  "relative overflow-hidden rounded-card border border-white/10 bg-white/[0.04] px-5 py-4 light:border-slate-200/80 light:bg-white/70";

export const numberBadgeClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#16a34a] bg-white text-[12px] font-semibold tabular-nums text-[#16a34a]";

export const ctaBase = [
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-semibold tracking-[-0.01em]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] light:focus-visible:ring-offset-white",
  "disabled:pointer-events-none disabled:opacity-50",
  btnHover,
].join(" ");

export const ctaSizes = {
  default: "px-6 py-3 text-[14px]",
  compact: "px-4 py-2 text-[13px]",
} as const;

export const ctaVariants = {
  primary:
    "bg-[#16a34a] text-white shadow-cta hover:bg-[#15803d] hover:shadow-cta-hover",
  secondary:
    "border border-white/12 bg-transparent text-slate-100 hover:border-white/20 hover:bg-white/[0.04] light:border-slate-200 light:text-slate-800 light:hover:border-slate-300 light:hover:bg-slate-50",
  ghost:
    "bg-transparent text-slate-200 hover:bg-white/[0.04] hover:text-white light:text-slate-700 light:hover:bg-slate-100 light:hover:text-slate-900",
} as const;

import type { ReactNode } from "react";

type ProjectArtProps = {
  kind: string;
};

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 56" aria-hidden>
      <rect width="100" height="56" className="hero-core-void" />
      <rect
        x="0.4"
        y="0.4"
        width="99.2"
        height="55.2"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.4"
      />
      {children}
    </svg>
  );
}

function office() {
  return (
    <>
      <circle cx="50" cy="28" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
      <circle cx="50" cy="28" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" />
      <line x1="32" y1="28" x2="68" y2="28" stroke="rgba(255,255,255,0.08)" strokeWidth="0.25" />
      <line x1="50" y1="12" x2="50" y2="44" stroke="rgba(255,255,255,0.08)" strokeWidth="0.25" />
      <circle cx="38" cy="20" r="1.1" fill="rgba(248,250,252,0.55)" />
      <circle cx="64" cy="22" r="1.1" fill="rgba(248,250,252,0.55)" />
      <circle cx="62" cy="38" r="1.1" fill="rgba(248,250,252,0.45)" />
      <circle cx="36" cy="36" r="1.1" fill="rgba(248,250,252,0.45)" />
      <line x1="50" y1="28" x2="38" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="0.22" />
      <line x1="50" y1="28" x2="64" y2="22" stroke="rgba(255,255,255,0.12)" strokeWidth="0.22" />
      <line x1="50" y1="28" x2="62" y2="38" stroke="rgba(255,255,255,0.1)" strokeWidth="0.22" />
      <line x1="50" y1="28" x2="36" y2="36" stroke="rgba(255,255,255,0.1)" strokeWidth="0.22" />
      <line x1="50" y1="28" x2="50" y2="10" stroke="#16a34a" strokeWidth="0.4" opacity="0.8" />
      <circle cx="50" cy="28" r="1.7" fill="#16a34a" />
    </>
  );
}

function agent() {
  return (
    <>
      <path
        d="M22 40 C22 22 78 22 78 40"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.3"
      />
      <circle cx="50" cy="24" r="11" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" />
      <circle cx="50" cy="24" r="5.5" fill="none" stroke="rgba(22,163,74,0.45)" strokeWidth="0.35" />
      <line x1="50" y1="35.5" x2="50" y2="46" stroke="rgba(255,255,255,0.12)" strokeWidth="0.25" />
      <line x1="38" y1="46" x2="62" y2="46" stroke="rgba(255,255,255,0.1)" strokeWidth="0.25" />
      <circle cx="50" cy="24" r="1.5" fill="#16a34a" />
    </>
  );
}

function portal() {
  return (
    <>
      <rect x="18" y="12" width="64" height="34" rx="1.2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
      <line x1="18" y1="18" x2="82" y2="18" stroke="rgba(255,255,255,0.08)" strokeWidth="0.25" />
      <circle cx="22.5" cy="15" r="0.7" fill="rgba(255,255,255,0.25)" />
      <circle cx="26" cy="15" r="0.7" fill="rgba(255,255,255,0.18)" />
      <circle cx="50" cy="34" r="9" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.28" />
      <line x1="50" y1="34" x2="50" y2="25" stroke="#16a34a" strokeWidth="0.35" />
      <circle cx="50" cy="34" r="1.4" fill="#16a34a" />
    </>
  );
}

function crm() {
  return (
    <>
      <line x1="16" y1="42" x2="84" y2="42" stroke="rgba(255,255,255,0.1)" strokeWidth="0.28" />
      <rect x="20" y="30" width="8" height="12" fill="rgba(255,255,255,0.06)" />
      <rect x="34" y="22" width="8" height="20" fill="rgba(255,255,255,0.08)" />
      <rect x="48" y="16" width="8" height="26" fill="rgba(22,163,74,0.28)" />
      <rect x="62" y="24" width="8" height="18" fill="rgba(255,255,255,0.08)" />
      <rect x="76" y="28" width="6" height="14" fill="rgba(255,255,255,0.06)" />
      <circle cx="52" cy="16" r="1.3" fill="#16a34a" />
    </>
  );
}

function infra() {
  return (
    <>
      <rect x="28" y="14" width="44" height="10" rx="1" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" />
      <rect x="32" y="28" width="36" height="10" rx="1" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
      <line x1="50" y1="24" x2="50" y2="28" stroke="rgba(255,255,255,0.12)" strokeWidth="0.25" />
      <line x1="40" y1="38" x2="40" y2="44" stroke="rgba(255,255,255,0.1)" strokeWidth="0.25" />
      <line x1="60" y1="38" x2="60" y2="44" stroke="rgba(255,255,255,0.1)" strokeWidth="0.25" />
      <circle cx="50" cy="19" r="1.4" fill="#16a34a" />
    </>
  );
}

function security() {
  return (
    <>
      <path
        d="M50 10 L72 18 L72 30 C72 40 62 46 50 48 C38 46 28 40 28 30 L28 18 Z"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.32"
      />
      <circle cx="50" cy="30" r="7" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.28" />
      <line x1="50" y1="30" x2="50" y2="23" stroke="#16a34a" strokeWidth="0.35" />
      <circle cx="50" cy="30" r="1.5" fill="#16a34a" />
    </>
  );
}

const drawings: Record<string, () => ReactNode> = {
  office,
  "ai-agent": agent,
  portal,
  crm,
  infra,
  security,
};

export default function ProjectArt({ kind }: ProjectArtProps) {
  const draw = drawings[kind] ?? office;

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#070d18] light:bg-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(22,163,74,0.1),transparent_55%)]" />
      <Frame>{draw()}</Frame>
    </div>
  );
}

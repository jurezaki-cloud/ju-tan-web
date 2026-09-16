type CoreMarkProps = {
  className?: string;
};

/** Signature: concentric rings, construction ticks, one filament. */
export default function CoreMark({ className = "h-3.5 w-3.5" }: CoreMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`block ${className}`}
      aria-hidden
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" opacity="0.28" />
      <circle cx="12" cy="12" r="5.6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="12" y1="2.2" x2="12" y2="4.4" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <line x1="12" y1="19.6" x2="12" y2="21.8" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <line x1="2.2" y1="12" x2="4.4" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <line x1="19.6" y1="12" x2="21.8" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <line x1="12" y1="12" x2="12" y2="3.4" stroke="#16a34a" strokeWidth="1.15" opacity="0.85" />
      <circle cx="12" cy="12" r="1.7" fill="#16a34a" />
    </svg>
  );
}

import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-1/2 z-20 -translate-x-1/2">
      <a
        href="#services"
        aria-label="Pomakni se na storitve"
        className="scroll-nudge flex min-h-11 min-w-11 flex-col items-center justify-center rounded-sm text-slate-400 transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        <span className="mb-2 text-xs uppercase tracking-[0.3em]">
          Pomakni se
        </span>

        <ChevronDown className="h-6 w-6" aria-hidden />
      </a>
    </div>
  );
}

import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-[max(0.5rem,env(safe-area-inset-bottom,0px))] left-1/2 z-20 hidden -translate-x-1/2 sm:block">
      <a
        href="#services"
        aria-label="Pomakni se na storitve"
        className="scroll-nudge flex min-h-11 min-w-11 flex-col items-center justify-center rounded-[10px] text-slate-500 transition-colors duration-200 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
      >
        <span className="mb-1 text-[10px] uppercase tracking-[0.22em]">
          Naprej
        </span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}

import { ChevronDown } from "lucide-react";
import { colorTransition, focusRing, kickerClass } from "@/design";
import { cn } from "@/lib/utils";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-[max(0.4rem,env(safe-area-inset-bottom,0px))] left-1/2 z-20 hidden -translate-x-1/2 sm:block">
      <a
        href="#services"
        aria-label="Pomakni se na rešitve JU-TAN"
        className={cn(
          "group relative flex min-h-11 min-w-11 flex-col items-center justify-center rounded-lg pt-3 text-slate-400/90 hover:text-slate-200",
          colorTransition,
          focusRing,
        )}
      >
        <span
          className="pointer-events-none absolute top-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(148,163,184,0.32),rgba(148,163,184,0))] transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <span className={cn(kickerClass, "mb-0.5 justify-center gap-0 text-[10px] tracking-[0.22em]")}>
          Naprej
        </span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}

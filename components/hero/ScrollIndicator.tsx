import { ChevronDown } from "lucide-react";
import { colorTransition, focusRing, kickerClass } from "@/design";
import { cn } from "@/lib/utils";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] left-1/2 z-20 hidden -translate-x-1/2 sm:block">
      <a
        href="#services"
        aria-label="Pomakni se na storitve"
        className={cn(
          "flex min-h-11 min-w-11 flex-col items-center justify-center rounded-lg text-slate-400 hover:text-slate-200",
          colorTransition,
          focusRing,
        )}
      >
        <span className={cn(kickerClass, "mb-0.5 justify-center gap-0")}>
          Naprej
        </span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}

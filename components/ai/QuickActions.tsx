"use client";

import { quickActions } from "./content";
import { colorTransition, focusRing } from "@/design";
import { cn } from "@/lib/utils";

type QuickActionsProps = {
  disabled?: boolean;
  onSelect: (prompt: string) => void;
};

export default function QuickActions({ disabled, onSelect }: QuickActionsProps) {
  return (
    <div
      className="flex shrink-0 gap-2 overflow-x-auto overscroll-x-contain border-b border-white/10 px-3 py-2 light:border-slate-200"
      aria-label="Hitri gumbi"
    >
      {quickActions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.prompt)}
          className={cn(
            "min-h-11 shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-slate-200 hover:border-green-600/50 hover:text-white disabled:opacity-50 light:border-slate-200 light:bg-white light:text-slate-800",
            colorTransition,
            focusRing,
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

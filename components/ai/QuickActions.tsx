"use client";

import { quickActions } from "./content";

type QuickActionsProps = {
  disabled?: boolean;
  onSelect: (prompt: string) => void;
};

export default function QuickActions({ disabled, onSelect }: QuickActionsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto border-b border-white/10 px-3 py-2 light:border-slate-200"
      aria-label="Hitri gumbi"
    >
      {quickActions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.prompt)}
          className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-slate-200 transition hover:border-[#22c55e]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] disabled:opacity-50 light:border-slate-200 light:bg-white light:text-slate-800"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

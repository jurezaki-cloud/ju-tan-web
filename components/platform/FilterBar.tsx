"use client";

import { cn } from "@/lib/utils";
import { colorTransition, focusRing } from "@/design";

export type FilterOption = {
  id: string;
  label: string;
};

type FilterBarProps = {
  options: FilterOption[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
};

export default function FilterBar({
  options,
  value,
  onChange,
  label = "Filtri",
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={active}
            className={cn(
              "min-h-11 rounded-lg border px-4 text-[13px] font-medium",
              colorTransition,
              focusRing,
              active
                ? "border-[#16a34a] text-[#16a34a]"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white light:border-slate-200 light:hover:border-slate-300 light:hover:text-slate-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

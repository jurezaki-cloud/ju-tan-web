"use client";

import { useRef } from "react";
import {
  projectFilters,
  type ProjectFilter,
} from "@/lib/data/projects";

type ProjectFiltersProps = {
  value: ProjectFilter;
  onChange: (filter: ProjectFilter) => void;
  panelId: string;
};

export default function ProjectFilters({
  value,
  onChange,
  panelId,
}: ProjectFiltersProps) {
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const moveFocus = (index: number) => {
    const next = (index + projectFilters.length) % projectFilters.length;
    const filter = projectFilters[next];
    onChange(filter);
    buttonsRef.current[next]?.focus();
  };

  return (
    <div
      className="-mt-4 mb-6 flex flex-wrap justify-center gap-2"
      role="tablist"
      aria-label="Filtri referenc"
    >
      {projectFilters.map((item, index) => {
        const active = value === item;
        const tabId = `project-filter-${item.toLowerCase()}`;

        return (
          <button
            key={item}
            id={tabId}
            ref={(node) => {
              buttonsRef.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveFocus(index + 1);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveFocus(index - 1);
              }
              if (event.key === "Home") {
                event.preventDefault();
                moveFocus(0);
              }
              if (event.key === "End") {
                event.preventDefault();
                moveFocus(projectFilters.length - 1);
              }
            }}
            className={`min-h-11 rounded-full border px-4 py-2 text-[13px] font-medium backdrop-blur-xl transition duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              active
                ? "border-green-400/50 bg-green-500/20 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.18)]"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-green-400/30 hover:text-white"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

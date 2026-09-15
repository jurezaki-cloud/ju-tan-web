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
      className="-mt-1 mb-7 flex flex-wrap gap-4"
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
            className={`relative min-h-11 rounded-[10px] px-1 py-2 text-[13px] font-medium tracking-[0.02em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
              active
                ? "text-white after:absolute after:inset-x-0 after:bottom-1 after:h-px after:bg-green-600/80"
                : "text-slate-500 hover:text-white"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClass } from "@/design";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Iskanje",
  label = "Iskanje",
  id = "platform-search",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(fieldClass, "pl-10")}
      />
    </div>
  );
}

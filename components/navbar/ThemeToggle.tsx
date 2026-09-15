"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  lightLabel: string;
  darkLabel: string;
};

export default function ThemeToggle({
  lightLabel,
  darkLabel,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={`${lightLabel} / ${darkLabel}`}
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-transparent text-slate-200 transition-colors duration-200 hover:border-white/16 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 light:border-slate-200 light:bg-white light:text-slate-800"
    >
      <Sun className="h-4 w-4 light:hidden" aria-hidden />
      <Moon className="hidden h-4 w-4 light:block" aria-hidden />
    </button>
  );
}

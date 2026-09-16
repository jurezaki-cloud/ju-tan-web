"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { iconButtonClass } from "@/design";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  lightLabel: string;
  darkLabel: string;
};

const subscribeNoop = () => () => {};

export default function ThemeToggle({
  lightLabel,
  darkLabel,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const isLight = mounted && resolvedTheme === "light";

  return (
    <button
      type="button"
      aria-label={isLight ? darkLabel : lightLabel}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={cn(
        iconButtonClass,
        "border border-white/10 bg-transparent text-slate-200 hover:border-white/16 hover:text-white light:border-slate-200 light:bg-white light:text-slate-800",
      )}
    >
      <Sun className="h-3.5 w-3.5 light:hidden" aria-hidden />
      <Moon className="hidden h-3.5 w-3.5 light:block" aria-hidden />
    </button>
  );
}

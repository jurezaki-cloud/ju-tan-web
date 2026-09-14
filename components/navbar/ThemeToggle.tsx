"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => undefined;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return <span className="inline-flex h-11 w-11 shrink-0" aria-hidden />;
  }

  const isDark = theme !== "light";

  return (
    <button
      type="button"
      aria-label={isDark ? "Vklopi svetlo temo" : "Vklopi temno temo"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-green-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:border-slate-200 light:bg-white light:text-slate-800"
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

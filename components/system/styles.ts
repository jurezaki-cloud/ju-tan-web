import { cn } from "@/lib/utils";

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const fieldStyles = cn(
  "w-full min-h-11 rounded-lg border border-border bg-surface px-md py-sm text-body text-foreground shadow-xs transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)]",
  "placeholder:text-muted-foreground",
  "hover:border-brand/30",
  "disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]",
  "aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20",
  focusRing,
);

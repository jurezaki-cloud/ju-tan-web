import { cn } from "@/lib/utils";
import { cardHover, cardSurface } from "@/design";
import type { ReactNode } from "react";

export const footerCardClass = cn(
  "group/card flex h-full w-full flex-col p-7 sm:p-8",
  cardSurface,
  cardHover,
);

export function FooterCardKicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#16a34a]">
      {children}
    </p>
  );
}

export function FooterCardTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 font-heading text-[1.5rem] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
      {children}
    </p>
  );
}

"use client";

import type { ReactNode } from "react";
import { cardSurface, headingCard, ctaBase, ctaSizes, ctaVariants } from "@/design";
import { cn } from "@/lib/utils";

export default function CRMFormDrawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-[#050816]/70">
      <div className={cn(cardSurface, "h-full w-full max-w-md overflow-y-auto p-6")} role="dialog" aria-modal="true">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className={headingCard}>{title}</h2>
          <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)} onClick={onClose}>
            Zapri
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

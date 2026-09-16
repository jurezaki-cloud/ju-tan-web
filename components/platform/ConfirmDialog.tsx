"use client";

import { cardSurface, ctaBase, ctaSizes, ctaVariants, headingCard, cardBodyClass } from "@/design";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Potrdi",
  cancelLabel = "Prekliči",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050816]/70 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className={cn(cardSurface, "w-full max-w-md p-6")}
      >
        <h2 id="confirm-dialog-title" className={headingCard}>
          {title}
        </h2>
        <p className={`mt-2 ${cardBodyClass}`}>{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

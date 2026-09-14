"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import NavLinks from "./NavLinks";
import CTAButton from "./CTAButton";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" id="mobile-menu">
      <button
        type="button"
        aria-label="Zapri meni"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Meni"
        className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col gap-8 border-l border-white/10 bg-[#050816]/95 p-6 pt-16 shadow-2xl"
      >
        <button
          type="button"
          aria-label="Zapri meni"
          className="absolute right-5 top-6 rounded-xl p-2 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          onClick={onClose}
        >
          <X size={28} aria-hidden />
        </button>

        <NavLinks
          onNavigate={onClose}
          className="flex flex-col gap-6"
        />

        <CTAButton
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/50"
        />
      </div>
    </div>
  );
}

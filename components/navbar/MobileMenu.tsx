"use client";

import { X } from "lucide-react";
import NavLinks from "./NavLinks";
import CTAButton from "./CTAButton";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Zapri meni"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col gap-8 border-l border-white/10 bg-[#050816]/95 p-6 pt-24 shadow-2xl">
        <button
          type="button"
          aria-label="Zapri meni"
          className="absolute right-5 top-6 rounded-xl p-2 text-white transition hover:bg-white/10"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        <NavLinks
          onNavigate={onClose}
          className="flex flex-col gap-6"
        />

        <CTAButton
          onClick={onClose}
          className="rounded-2xl bg-gradient-to-r from-green-600 to-green-500 px-7 py-3 text-center font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-green-400/60"
        />
      </div>
    </div>
  );
}

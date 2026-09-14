"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import NavLinks from "./NavLinks";
import CTAButton from "./CTAButton";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overscroll-none lg:hidden"
      id="mobile-menu"
    >
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
        className="absolute right-0 top-0 flex h-dvh w-[min(100%,20rem)] flex-col gap-6 overflow-y-auto overscroll-contain border-l border-white/10 bg-[#050816]/95 p-6 shadow-2xl pt-[max(4rem,calc(env(safe-area-inset-top,0px)+2.5rem))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))]"
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Zapri meni"
          className="absolute right-[max(1.25rem,env(safe-area-inset-right,0px))] top-[max(1.25rem,env(safe-area-inset-top,0px))] inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          onClick={onClose}
        >
          <X size={28} aria-hidden />
        </button>

        <NavLinks
          onNavigate={onClose}
          className="flex flex-col gap-1"
          linkClassName="min-h-11 inline-flex items-center"
        />

        <CTAButton
          onClick={onClose}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/50"
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useId, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AgentWindowProps = {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  children: ReactNode;
};

export default function AgentWindow({
  open,
  onClose,
  onClear,
  children,
}: AgentWindowProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          key="window"
          id="jutan-agent-window"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.97 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pointer-events-auto flex h-[100dvh] w-full flex-col overflow-hidden border-white/10 bg-[#050816]/88 shadow-xl backdrop-blur-2xl md:h-[min(40rem,calc(100dvh-2rem))] md:w-[420px] md:rounded-2xl md:border light:border-slate-200 light:bg-white/95"
        >
          <header className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#16a34a]/15 px-3 py-3 light:border-slate-200 light:bg-green-50">
            <div>
              <h2
                id={titleId}
                className="font-heading text-[16px] font-semibold text-white light:text-slate-900"
              >
                🤖 JU-TAN AI
              </h2>
              <p className="text-[12px] text-[#22c55e] light:text-[#16a34a]">
                Vaš digitalni pomočnik
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                aria-label="Počisti pogovor"
                onClick={onClear}
                className="h-9 w-9 text-slate-300 hover:bg-white/10 hover:text-white light:text-slate-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                aria-label="Zapri JU-TAN AI"
                onClick={onClose}
                className="h-9 w-9 text-slate-300 hover:bg-white/10 hover:text-white light:text-slate-600"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </header>
          {children}
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

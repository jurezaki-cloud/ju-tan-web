"use client";

import { useEffect, useId, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lockBodyScroll } from "@/lib/lock-body-scroll";

type AgentWindowProps = {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  panelHeight?: number | null;
  children: ReactNode;
};

export default function AgentWindow({
  open,
  onClose,
  onClear,
  panelHeight,
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
    const unlock = lockBodyScroll();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlock();
    };
  }, [open, onClose]);

  const style: CSSProperties | undefined =
    panelHeight && panelHeight > 0
      ? { height: panelHeight, maxHeight: panelHeight }
      : undefined;

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          key="window"
          id="jutan-agent-window"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={style}
          className="pointer-events-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden border-white/10 bg-[#050816]/88 shadow-xl backdrop-blur-2xl md:h-[min(40rem,calc(100dvh-2rem))] md:max-h-[min(40rem,calc(100dvh-2rem))] md:w-[420px] md:rounded-2xl md:border light:border-slate-200 light:bg-white/95"
        >
          <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#16a34a]/15 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] backdrop-blur-md light:border-slate-200 light:bg-green-50">
            <div className="min-w-0">
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
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                aria-label="Počisti pogovor"
                onClick={onClear}
                className="h-11 w-11 text-slate-300 hover:bg-white/10 hover:text-white light:text-slate-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                aria-label="Zapri JU-TAN AI"
                onClick={onClose}
                className="h-11 w-11 text-slate-300 hover:bg-white/10 hover:text-white light:text-slate-600"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </header>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

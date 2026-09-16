"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
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

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function AgentWindow({
  open,
  onClose,
  onClear,
  panelHeight,
  children,
}: AgentWindowProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const nodes = [
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((node) => !node.hasAttribute("disabled"));

      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const unlock = lockBodyScroll();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlock();
      restoreFocusRef.current?.focus();
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
          ref={panelRef}
          id="jutan-agent-window"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={style}
          className="pointer-events-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden border-white/10 bg-[#050816]/88 shadow-[0_18px_40px_rgb(0_0_0_/_36%)] backdrop-blur-2xl md:h-[min(40rem,calc(100dvh-2rem))] md:max-h-[min(40rem,calc(100dvh-2rem))] md:w-[420px] md:rounded-lg md:border light:border-slate-200 light:bg-white/95"
        >
          <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#16a34a]/15 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] backdrop-blur-md light:border-slate-200 light:bg-green-50">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="font-heading text-[16px] font-semibold text-white light:text-slate-900"
              >
                JU-TAN vodič
              </h2>
              <p className="text-[12px] leading-5 text-slate-400 light:text-slate-600">
                Kratki odgovori po storitvah, ne pogovorni model.
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
                ref={closeRef}
                type="button"
                variant="ghost"
                aria-label="Zapri vodič storitev"
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

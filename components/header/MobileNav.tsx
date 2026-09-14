"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { HeaderNavItem } from "@/lib/navigation";
import NavItem from "./NavItem";
import CTAButton from "./CTAButton";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: HeaderNavItem[];
  activeId: HeaderNavItem["id"] | null;
  labels: {
    menuAria: string;
    closeMenu: string;
  };
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileNav({
  open,
  onClose,
  items,
  activeId,
  labels,
}: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const nodes = [
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((node) => node.offsetParent !== null);

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

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div className="lg:hidden" id="mobile-navigation">
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              key="header-nav-overlay"
              type="button"
              aria-label={labels.closeMenu}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={onClose}
            />

            <motion.div
              key="header-nav-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={labels.menuAria}
              className="fixed inset-y-0 right-0 z-[51] flex h-dvh w-[min(100%,20rem)] flex-col overflow-y-auto overscroll-contain border-l border-white/10 bg-[#050816]/96 px-6 pt-[max(4.5rem,calc(env(safe-area-inset-top,0px)+3rem))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] shadow-2xl light:bg-white/96"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "100%" }}
              transition={{
                duration: reduceMotion ? 0 : 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <button
                ref={closeRef}
                type="button"
                aria-label={labels.closeMenu}
                className="absolute right-[max(1.25rem,env(safe-area-inset-right,0px))] top-[max(1.25rem,env(safe-area-inset-top,0px))] inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:text-slate-900 light:hover:bg-slate-100"
                onClick={onClose}
              >
                <X size={28} aria-hidden />
              </button>

              <nav aria-label={labels.menuAria} className="flex flex-col gap-1">
                {items.map((item) => (
                  <NavItem
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    active={activeId === item.id}
                    onNavigate={onClose}
                    className="w-full justify-start after:hidden"
                  />
                ))}
              </nav>

              <CTAButton className="mt-8 w-full" onClick={onClose} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

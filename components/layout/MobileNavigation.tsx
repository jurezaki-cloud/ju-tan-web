"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { NavItem, NavSectionId } from "@/types/navigation";
import { getMessages } from "@/lib/i18n/messages";
import HeaderCTA from "./HeaderCTA";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { colorTransition, duration, easeOut, focusRing, iconButtonClass } from "@/design";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeSection: NavSectionId | null;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const transition = { duration: duration.hover, ease: easeOut };

export default function MobileNavigation({
  open,
  onClose,
  items,
  activeSection,
}: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const copy = getMessages().header;

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
      ];

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
    <div className="xl:hidden" id="mobile-navigation">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="header-mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={copy.menuAria}
            className="fixed inset-0 z-overlay flex h-dvh flex-col bg-[#050816]/96 px-4 pt-[max(4.75rem,calc(env(safe-area-inset-top,0px)+3.5rem))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] backdrop-blur-xl light:bg-white/96"
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 16 }}
            transition={transition}
          >
            <button
              ref={closeRef}
              type="button"
              aria-label={copy.closeMenu}
              className={cn(
                iconButtonClass,
                "absolute right-[max(1rem,env(safe-area-inset-right,0px))] top-[max(1.25rem,env(safe-area-inset-top,0px))] text-white hover:bg-white/10 light:text-slate-900 light:hover:bg-slate-100",
              )}
              onClick={onClose}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            <nav
              aria-label={copy.navAria}
              className="flex flex-1 flex-col items-center justify-center gap-4"
            >
              {items.map((item) => {
                const active = activeSection === item.sectionId;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center text-[14px] font-medium tracking-[0.02em] text-slate-200 hover:text-white light:text-slate-800",
                      colorTransition,
                      focusRing,
                      active ? "text-white after:opacity-100 light:text-slate-900" : "after:opacity-0",
                      "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-[#16a34a] after:transition-opacity after:duration-hover after:ease-out hover:after:opacity-100",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <HeaderCTA className="w-full" onClick={onClose} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { NavItem, NavSectionId } from "@/types/navigation";
import { getMessages } from "@/lib/i18n/messages";
import HeaderCTA from "./HeaderCTA";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { colorTransition, focusRing, iconButtonClass } from "@/design";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeSection: NavSectionId | null;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileNavigation({
  open,
  onClose,
  items,
  activeSection,
}: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const copy = getMessages().header;
  const [present, setPresent] = useState(open);
  const [entered, setEntered] = useState(open);

  if (open && !present) {
    setPresent(true);
    setEntered(false);
  } else if (!open && entered) {
    setEntered(false);
  }

  useEffect(() => {
    if (!present || !open) return;
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, [present, open]);

  useEffect(() => {
    if (open || !present) return;
    const timeout = window.setTimeout(() => setPresent(false), reduceMotion ? 0 : 200);
    return () => window.clearTimeout(timeout);
  }, [open, present, reduceMotion]);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
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
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    };
  }, [open, onClose]);

  return (
    <div className="xl:hidden" id="mobile-navigation">
      {present ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={copy.menuAria}
          className={cn(
            "mobile-nav-panel fixed inset-0 z-overlay flex h-dvh flex-col overflow-y-auto overscroll-contain bg-[#050816]/96 px-4 pt-[max(4.75rem,calc(env(safe-area-inset-top,0px)+3.5rem))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] backdrop-blur-xl light:bg-white/96",
            entered && "mobile-nav-panel-open",
            reduceMotion && "mobile-nav-panel-reduced",
          )}
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
            className="flex flex-1 flex-col items-center justify-center gap-2 py-4 sm:gap-4"
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
        </div>
      ) : null}
    </div>
  );
}

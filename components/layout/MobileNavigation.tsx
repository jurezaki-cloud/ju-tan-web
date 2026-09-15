"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { NavItem, NavSectionId } from "@/types/navigation";
import { getMessages } from "@/lib/i18n/messages";
import HeaderCTA from "./HeaderCTA";

const CloseIcon = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.X })),
  {
    ssr: true,
    loading: () => <span className="size-7" aria-hidden />,
  },
);

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeSection: NavSectionId | null;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const transition = { duration: 0.2, ease: "easeOut" as const };

export default function MobileNavigation({
  open,
  onClose,
  items,
  activeSection,
}: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
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
    <div className="lg:hidden" id="mobile-navigation">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="header-mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={copy.menuAria}
            className="fixed inset-0 z-[60] flex h-dvh flex-col bg-[#050816] px-4 pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4rem))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] light:bg-white"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            transition={transition}
          >
            <button
              ref={closeRef}
              type="button"
              aria-label={copy.closeMenu}
              className="absolute right-[max(1rem,env(safe-area-inset-right,0px))] top-[max(1.25rem,env(safe-area-inset-top,0px))] inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors duration-200 ease-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:text-slate-900 light:hover:bg-slate-100"
              onClick={onClose}
            >
              <CloseIcon size={28} aria-hidden />
            </button>

            <nav
              aria-label={copy.navAria}
              className="flex flex-1 flex-col items-center justify-center gap-2"
            >
              {items.map((item) => {
                const active = activeSection === item.sectionId;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center text-xl font-medium text-slate-200 transition-colors duration-200 ease-out hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:text-slate-800 ${
                      active ? "text-green-400 light:text-green-600" : ""
                    }`}
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

"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { easeOut, cardSurface, colorTransition, focusRing } from "@/design";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type PrivacyAccordionItemProps = {
  id: string;
  number: string;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function PrivacyAccordionItem({
  id,
  number,
  title,
  defaultOpen = false,
  children,
}: PrivacyAccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = usePrefersReducedMotion();

  return (
    <section
      id={id}
      className={cn("overflow-hidden", cardSurface)}
    >
      <h2 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "flex min-h-11 w-full items-center gap-4 px-5 py-5 text-left hover:bg-white/[0.03] sm:px-7",
            colorTransition,
            focusRing,
          )}
        >
          <span className="font-heading text-[12px] font-medium tabular-nums tracking-[0.14em] text-green-600/80">
            {number}
          </span>
          <span className="flex-1 font-heading text-[17px] font-semibold tracking-[-0.03em] text-white sm:text-[19px] light:text-slate-900">
            {title}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-hover ease-out",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </h2>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${id}-panel`}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.35, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8 px-5 pb-7 pt-5 sm:px-7">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

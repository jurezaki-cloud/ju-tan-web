"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowRight, LayoutGrid } from "lucide-react";
import CTAButton from "@/components/navbar/CTAButton";
import { heroCopy } from "./copy";

export default function HeroButtons() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
      <CTAButton
        href="#contact"
        aria-label={heroCopy.primaryCtaAria}
        className={reduceMotion ? "hover:translate-y-0" : undefined}
      >
        {heroCopy.primaryCta}
        <ArrowRight className="h-5 w-5 transition-transform duration-[250ms] group-hover:translate-x-1" />
      </CTAButton>

      <a
        href="#services"
        aria-label={heroCopy.secondaryCtaAria}
        className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white shadow-md shadow-black/20 backdrop-blur-sm transition duration-[250ms] hover:border-green-500/50 hover:bg-white/10 hover:shadow-lg hover:shadow-green-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:w-auto"
      >
        {heroCopy.secondaryCta}
        <LayoutGrid
          className="transition-transform duration-[250ms] group-hover:scale-110"
          size={20}
          aria-hidden
        />
      </a>
    </div>
  );
}

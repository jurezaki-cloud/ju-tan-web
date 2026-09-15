"use client";

import { ArrowRight, LayoutGrid } from "lucide-react";
import CTAButton from "@/components/navbar/CTAButton";
import { heroCopy } from "./copy";
import HeroReveal from "./HeroReveal";

export default function HeroButtons() {
  return (
    <HeroReveal delay={0.28}>
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
        <CTAButton
          href="#contact"
          aria-label={heroCopy.primaryCtaAria}
          className="w-full sm:w-auto"
        >
          {heroCopy.primaryCta}
          <ArrowRight className="h-5 w-5 transition-transform duration-[250ms] group-hover:translate-x-1" />
        </CTAButton>

        <CTAButton
          href="#projects"
          variant="secondary"
          aria-label={heroCopy.secondaryCtaAria}
          className="w-full sm:w-auto"
        >
          {heroCopy.secondaryCta}
          <LayoutGrid
            className="transition-transform duration-[250ms] group-hover:scale-110"
            size={20}
            aria-hidden
          />
        </CTAButton>
      </div>
    </HeroReveal>
  );
}

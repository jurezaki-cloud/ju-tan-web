"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CTAButton from "@/components/navbar/CTAButton";
import { duration, easeOut } from "@/design";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type PremiumCTAProps = {
  title: string;
  description: string;
  action: string;
  heading?: "h2" | "h3";
  href?: string;
  "aria-label"?: string;
};

export default function PremiumCTA({
  title,
  description,
  action,
  heading = "h3",
  href = "/#contact",
  "aria-label": ariaLabel,
}: PremiumCTAProps) {
  const Heading = heading;
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduceMotion ? 0.01 : duration.base, ease: easeOut }}
      className="border-t border-white/[0.08] pt-8"
    >
      <Heading className="heading-display relative font-heading font-semibold text-white light:text-slate-900">
        {title}
      </Heading>
      <p className="relative mt-3 max-w-xl text-[16px] leading-[1.7] text-slate-400">
        {description}
      </p>
      <div className="relative mt-6">
        <CTAButton href={href} aria-label={ariaLabel ?? action}>
          {action}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </CTAButton>
      </div>
    </motion.div>
  );
}

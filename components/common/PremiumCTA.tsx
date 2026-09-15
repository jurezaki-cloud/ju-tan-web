"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CTAButton from "@/components/navbar/CTAButton";

type PremiumCTAProps = {
  title: string;
  description: string;
  action?: string;
  heading?: "h2" | "h3";
};

export default function PremiumCTA({
  title,
  description,
  action = "Brezplačen posvet",
  heading = "h3",
}: PremiumCTAProps) {
  const Heading = heading;
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-card backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-400/10" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />

      <Heading className="relative font-heading text-[28px] font-semibold leading-[1.2] tracking-[-0.03em] text-white md:text-[32px]">
        {title}
      </Heading>
      <p className="relative mx-auto mt-3 max-w-xl text-[16px] leading-[1.7] text-slate-400">
        {description}
      </p>
      <div className="relative mt-6 flex justify-center">
        <CTAButton>
          {action}
          <ArrowRight className="h-5 w-5 transition-transform duration-[250ms] group-hover:translate-x-1" />
        </CTAButton>
      </div>
    </motion.div>
  );
}

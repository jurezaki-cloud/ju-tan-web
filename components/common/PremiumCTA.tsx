"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CTAButton from "@/components/navbar/CTAButton";

type PremiumCTAProps = {
  title: string;
  description: string;
  action?: string;
};

export default function PremiumCTA({
  title,
  description,
  action = "Stopite v stik",
}: PremiumCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-400/10" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />

      <h3 className="relative font-heading text-[28px] font-semibold tracking-[-0.03em] text-white md:text-[32px]">
        {title}
      </h3>
      <p className="relative mx-auto mt-3 max-w-xl text-[16px] leading-[1.7] text-slate-400">
        {description}
      </p>
      <div className="relative mt-6 flex justify-center">
        <CTAButton className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/50">
          {action}
          <ArrowRight className="h-5 w-5 transition-transform duration-[250ms] group-hover:translate-x-1" />
        </CTAButton>
      </div>
    </motion.div>
  );
}

"use client";

import HeroBadge from "./HeroBadge";
import HeroReveal from "./HeroReveal";
import HeroPills from "./HeroPills";
import { heroCopy } from "./copy";
import { typography } from "@/design";

export default function HeroContent() {
  return (
    <div className="max-w-3xl min-w-0">
      <HeroReveal>
        <HeroBadge />
      </HeroReveal>

      <HeroReveal delay={0.08}>
        <h1
          className="font-heading font-semibold tracking-[-0.045em] break-words text-white light:text-slate-900"
          style={{
            fontSize: typography.h1,
            lineHeight: typography.leadingTight,
          }}
        >
          {heroCopy.titleLead}
          <br />
          <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
            {heroCopy.titleAccent}
          </span>
          <br />
          {heroCopy.titleRest}
        </h1>
      </HeroReveal>

      <HeroReveal delay={0.16}>
        <p className="mt-6 max-w-[42rem] text-[18px] leading-[1.7] tracking-[-0.01em] text-slate-300 light:text-slate-600">
          {heroCopy.description}
        </p>
      </HeroReveal>

      <HeroReveal delay={0.22}>
        <HeroPills />
      </HeroReveal>
    </div>
  );
}

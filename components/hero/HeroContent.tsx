"use client";

import HeroBadge from "./HeroBadge";
import HeroReveal from "./HeroReveal";
import { heroCopy } from "./copy";

export default function HeroContent() {
  return (
    <div className="max-w-3xl min-w-0">
      <HeroReveal>
        <HeroBadge />
      </HeroReveal>

      <HeroReveal delay={0.08}>
        <h1 className="font-heading text-[clamp(1.75rem,8vw,2.15rem)] font-semibold leading-[1.15] tracking-[-0.04em] break-words text-white sm:text-[42px] md:text-[54px] lg:text-[64px] sm:leading-[1.08]">
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
        <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] tracking-[-0.01em] text-slate-300">
          {heroCopy.description}
        </p>
      </HeroReveal>
    </div>
  );
}

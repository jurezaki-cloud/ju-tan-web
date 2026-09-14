"use client";

import { Sparkles } from "lucide-react";
import { company } from "@/lib/data/company";

export default function HeroContent() {
  const [first, accent, ...rest] = company.headline.split(" ");
  const restLine = rest.join(" ");

  return (
    <div className="max-w-3xl">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 backdrop-blur-md">
        <Sparkles className="h-4 w-4" />
        {company.badge}
      </div>

      <h1 className="text-[34px] font-black leading-[1.12] tracking-tight text-white sm:text-[44px] md:text-[62px]">
        {first}
        <br />
        <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
          {accent}
        </span>
        {restLine ? (
          <>
            <br />
            {restLine}
          </>
        ) : null}
      </h1>

      <p className="mt-3 max-w-2xl text-[16px] leading-[1.65] text-slate-300">
        {company.description}
      </p>
    </div>
  );
}

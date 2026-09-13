"use client";

import { company } from "@/lib/data/company";

export default function HeroContent() {
  const [first, accent, ...rest] = company.headline.split(" ");
  const restLine = rest.join(" ");

  return (
    <div className="relative z-20 flex min-h-screen w-full items-center">
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 backdrop-blur-md">
          {company.badge}
        </div>

        <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
          {first}
          <br />
          <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
            {accent}
          </span>
          <br />
          {restLine}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
          {company.description}
        </p>
      </div>
    </div>
  );
}

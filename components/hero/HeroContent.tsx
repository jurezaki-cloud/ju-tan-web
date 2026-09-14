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

      <h1 className="font-heading text-[32px] font-semibold leading-[1.1] tracking-[-0.04em] text-white sm:text-[42px] md:text-[54px] lg:text-[64px]">
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

      <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] tracking-[-0.01em] text-slate-300">
        {company.description}
      </p>
    </div>
  );
}

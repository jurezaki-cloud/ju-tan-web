import { company } from "@/lib/data/company";
import HeroBadge from "./HeroBadge";

export default function HeroContent() {
  const [first, accent, ...rest] = company.headline.split(" ");
  const restLine = rest.join(" ");

  return (
    <div className="max-w-3xl min-w-0">
      <HeroBadge />

      <h1 className="font-heading text-[clamp(1.75rem,8vw,2rem)] font-semibold leading-[1.15] tracking-[-0.04em] break-words text-white sm:text-[42px] md:text-[54px] lg:text-[64px] sm:leading-[1.1]">
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

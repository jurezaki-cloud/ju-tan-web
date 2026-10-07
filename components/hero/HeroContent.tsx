import HeroBadge from "./HeroBadge";
import HeroReveal from "./HeroReveal";
import { heroCopy } from "./copy";
import { bodyClass, ledeClass } from "@/design";
import { cn } from "@/lib/utils";

export default function HeroContent() {
  return (
    <div className="max-w-[36rem] min-w-0">
      <HeroReveal>
        <HeroBadge />
      </HeroReveal>

      <HeroReveal delay={0.04}>
        <h1 className="heading-hero max-w-[12ch] font-heading font-semibold break-words text-white light:text-slate-900">
          {heroCopy.titleLead}{" "}
          <span className="text-[#16a34a] light:text-[#15803d]">{heroCopy.titleAccent}</span>{" "}
          {heroCopy.titleRest}
        </h1>
      </HeroReveal>

      <HeroReveal delay={0.08}>
        <p
          className={cn(
            bodyClass,
            "mt-5 max-w-[33rem] text-[17px] leading-[1.58] text-slate-100 light:text-slate-700 md:text-[18px]",
          )}
        >
          {heroCopy.description}
        </p>
        <p
          className={cn(
            ledeClass,
            "mt-3 max-w-[31rem] text-[15px] leading-[1.68] text-slate-400/90 light:text-slate-600 md:text-[16px]",
          )}
        >
          {heroCopy.supporting}
        </p>
      </HeroReveal>
    </div>
  );
}

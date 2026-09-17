import HeroBadge from "./HeroBadge";
import HeroReveal from "./HeroReveal";
import { heroCopy } from "./copy";
import { bodyClass, ledeClass } from "@/design";
import { cn } from "@/lib/utils";

export default function HeroContent() {
  return (
    <div className="max-w-[37rem] min-w-0">
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
        <p className={cn(bodyClass, "mt-6 max-w-[34rem] text-[17px] text-slate-200 md:text-[18px]")}>
          {heroCopy.description}
        </p>
        <p className={cn(ledeClass, "mt-4 max-w-[34rem] text-slate-400 light:text-slate-600")}>
          {heroCopy.supporting}
        </p>
      </HeroReveal>
    </div>
  );
}

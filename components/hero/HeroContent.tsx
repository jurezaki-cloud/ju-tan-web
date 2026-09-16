import HeroBadge from "./HeroBadge";
import HeroReveal from "./HeroReveal";
import HeroPills from "./HeroPills";
import { heroCopy } from "./copy";
import { bodyClass, ledeClass } from "@/design";
import { cn } from "@/lib/utils";

export default function HeroContent() {
  return (
    <div className="max-w-[34rem] min-w-0">
      <HeroReveal>
        <HeroBadge />
      </HeroReveal>

      <HeroReveal delay={0.04}>
        <h1 className="heading-hero font-heading font-semibold break-words text-white light:text-slate-900">
          {heroCopy.titleLead}{" "}
          <span className="text-[#16a34a] light:text-[#15803d]">{heroCopy.titleAccent}</span>{" "}
          {heroCopy.titleRest}
        </h1>
      </HeroReveal>

      <HeroReveal delay={0.08}>
        <p className={cn(bodyClass, "mt-5 text-slate-300 light:text-slate-600")}>
          {heroCopy.description}
        </p>
        <p className={cn(ledeClass, "mt-4 max-w-[32rem]")}>
          {heroCopy.supporting}
        </p>
      </HeroReveal>

      <HeroReveal delay={0.12}>
        <HeroPills />
      </HeroReveal>
    </div>
  );
}

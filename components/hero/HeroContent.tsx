import HeroBadge from "./HeroBadge";
import HeroReveal from "./HeroReveal";
import HeroPills from "./HeroPills";
import { heroCopy } from "./copy";

export default function HeroContent() {
  return (
    <div className="max-w-xl min-w-0 lg:max-w-[36.5rem]">
      <HeroReveal>
        <HeroBadge />
      </HeroReveal>

      <HeroReveal delay={0.08}>
        <h1 className="heading-hero font-heading font-semibold break-words text-white light:text-slate-900">
          {heroCopy.titleLead}
          <br />
          <span className="text-[#16a34a] light:text-[#15803d]">{heroCopy.titleAccent}</span>
          <br />
          {heroCopy.titleRest}
        </h1>
      </HeroReveal>

      <HeroReveal delay={0.16}>
        <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.7] tracking-[-0.011em] text-slate-300 light:text-slate-600">
          {heroCopy.description}
        </p>
      </HeroReveal>

      <HeroReveal delay={0.22}>
        <HeroPills />
      </HeroReveal>
    </div>
  );
}

import { ArrowRight, LayoutGrid } from "lucide-react";
import CtaLink from "@/components/navbar/CtaLink";
import { heroCopy } from "./copy";
import HeroReveal from "./HeroReveal";

export default function HeroButtons() {
  return (
    <HeroReveal delay={0.2}>
      <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
        <CtaLink
          href="/kontakt"
          aria-label={heroCopy.primaryCtaAria}
          className="w-full sm:w-auto"
        >
          {heroCopy.primaryCta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </CtaLink>

        <CtaLink
          href="#podrocja-sodelovanja"
          variant="secondary"
          aria-label={heroCopy.secondaryCtaAria}
          className="w-full sm:w-auto"
        >
          {heroCopy.secondaryCta}
          <LayoutGrid className="h-4 w-4" aria-hidden />
        </CtaLink>
      </div>
    </HeroReveal>
  );
}

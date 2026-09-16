import type { LucideIcon } from "lucide-react";
import BaseCard from "@/components/common/BaseCard";
import { cardIcon, headingCard, cardBodyClass, metaClass } from "@/design";

type ServiceCardProps = {
  index: string;
  icon: LucideIcon;
  title: string;
  problem: string;
  solution: string;
  result: string;
};

export default function ServiceCard({
  index,
  icon: Icon,
  title,
  problem,
  solution,
  result,
}: ServiceCardProps) {
  return (
    <BaseCard
      href="/kontakt"
      aria-label={`${title} — pošlji povpraševanje`}
      className="flex h-full min-h-[220px] items-start"
    >
      <span
        className="pointer-events-none absolute font-heading text-[7.5rem] font-bold leading-none tabular-nums tracking-[-0.06em] text-white opacity-[0.06] light:text-slate-900"
        aria-hidden
      >
        {index}
      </span>

      <div className="relative z-[1] flex w-full items-start gap-5">
        <span className={cardIcon}>
          <Icon className="h-8 w-8" strokeWidth={1.6} aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className={headingCard}>{title}</h3>
          <p className={`mt-2 ${metaClass}`}>{problem}</p>
          <p className={`mt-1.5 ${cardBodyClass} sm:text-[15px]`}>{solution}</p>
          <p className={`mt-3 ${cardBodyClass} text-slate-300 light:text-slate-700`}>
            {result}
          </p>
        </div>
      </div>
    </BaseCard>
  );
}

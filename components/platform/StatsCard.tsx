import type { LucideIcon } from "lucide-react";
import { cardIcon, cardSurface, headingCard, metaClass } from "@/design";

type StatsCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
};

function StatsCard({
  label,
  value,
  hint,
  icon: Icon,
}: StatsCardProps) {
  return (
    <article className={`${cardSurface} flex h-full items-start gap-4 p-6`}>
      <span className={cardIcon}>
        <Icon className="h-8 w-8" strokeWidth={1.6} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className={metaClass}>{label}</p>
        <p className={`${headingCard} mt-1 tabular-nums`}>{value}</p>
        {hint ? <p className={`${metaClass} mt-1`}>{hint}</p> : null}
      </div>
    </article>
  );
}

export default StatsCard;
export { StatsCard as StatCard };

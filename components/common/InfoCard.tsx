import type { LucideIcon } from "lucide-react";
import BaseCard from "@/components/common/BaseCard";
import { cardIcon, headingCard, cardBodyClass } from "@/design";

type InfoCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export default function InfoCard({ icon: Icon, title, text }: InfoCardProps) {
  return (
    <BaseCard className="flex h-full min-h-[168px] items-start">
      <div className="relative z-[1] flex w-full items-start gap-5">
        <span className={cardIcon}>
          <Icon className="h-8 w-8" strokeWidth={1.6} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={headingCard}>{title}</h3>
          <p className={`mt-1.5 ${cardBodyClass} sm:text-[15px]`}>{text}</p>
        </div>
      </div>
    </BaseCard>
  );
}

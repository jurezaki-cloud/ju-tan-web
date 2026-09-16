import type { LucideIcon } from "lucide-react";
import BaseCard from "@/components/common/BaseCard";
import { cardIcon, headingCard, metaClass } from "@/design";

type TechCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export default function TechCard({ icon: Icon, title, text }: TechCardProps) {
  return (
    <BaseCard className="flex h-full min-h-[9.5rem] w-full flex-col items-center text-center">
      <span className={`mb-4 ${cardIcon}`}>
        <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden />
      </span>
      <h3 className={headingCard}>{title}</h3>
      <p className={`mt-2 ${metaClass} leading-[1.55]`}>{text}</p>
    </BaseCard>
  );
}

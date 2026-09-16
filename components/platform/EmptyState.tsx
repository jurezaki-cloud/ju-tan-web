import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cardBodyClass, headingCard } from "@/design";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <Icon className="h-8 w-8 text-[#16a34a]" strokeWidth={1.6} aria-hidden />
      <p className={`mt-4 ${headingCard}`}>{title}</p>
      <p className={`mt-1.5 max-w-sm ${cardBodyClass}`}>{description}</p>
    </div>
  );
}

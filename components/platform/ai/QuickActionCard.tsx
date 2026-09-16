import Link from "next/link";
import { cardIcon, cardSurface, headingCard, cardBodyClass, focusRing, cardHover } from "@/design";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import type { QuickAction } from "@/src/ai/types";

export default function QuickActionCard({ action }: { action: QuickAction }) {
  return (
    <Link
      href={`/ai?ws=${action.workspace}&c=${action.conversationId}`}
      className={cn(cardSurface, cardHover, focusRing, "flex h-full flex-col p-6")}
    >
      <span className={cardIcon}>
        <FileText className="h-8 w-8" strokeWidth={1.6} aria-hidden />
      </span>
      <h3 className={`${headingCard} mt-4`}>{action.title}</h3>
      <p className={`mt-1.5 ${cardBodyClass}`}>{action.description}</p>
    </Link>
  );
}

import Link from "next/link";
import { ctaBase, ctaSizes, ctaVariants } from "@/design";
import { cn } from "@/lib/utils";
import type { Suggestion } from "@/src/ai/types";

export default function SuggestionBar({ items }: { items: Suggestion[] }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Predlogi">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

import { cardSurface, headingCard, cardBodyClass } from "@/design";
import { cn } from "@/lib/utils";
import type { KnowledgeItem } from "@/src/ai/types";

export default function KnowledgeCard({ item }: { item: KnowledgeItem }) {
  return (
    <article className={cn(cardSurface, "h-full p-6")} aria-labelledby={`kb-${item.id}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
        {item.collection}
      </p>
      <h3 id={`kb-${item.id}`} className={`${headingCard} mt-2`}>
        {item.title}
      </h3>
      <p className={`mt-2 ${cardBodyClass}`}>{item.summary}</p>
      <p className="mt-4 text-[12px] text-slate-500">
        Zbirka pripravljena za RAG. Indeks še ni priklopljen.
      </p>
    </article>
  );
}

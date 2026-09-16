import SectionCard from "@/components/platform/SectionCard";
import type { OfferDraft } from "@/src/domain/offers";
import { cardBodyClass, metaClass } from "@/design";

export default function OfferDraftPanel({ draft }: { draft?: OfferDraft }) {
  if (!draft) {
    return (
      <SectionCard title="AI osnutek">
        <p className={metaClass}>Ni osnutka.</p>
      </SectionCard>
    );
  }
  return (
    <SectionCard title="AI osnutek">
      <p className={metaClass}>Vir: {draft.source}</p>
      <p className={`mt-2 ${cardBodyClass}`}>{draft.aiSummary ?? "—"}</p>
      <p className={`mt-3 ${metaClass}`}>Predpostavke</p>
      <p className={cardBodyClass}>{draft.assumptions ?? "—"}</p>
      <p className={`mt-3 ${metaClass}`}>Tveganja</p>
      <p className={cardBodyClass}>{draft.risks ?? "—"}</p>
    </SectionCard>
  );
}

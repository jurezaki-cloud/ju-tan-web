import SectionCard from "@/components/platform/SectionCard";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import type { Offer } from "@/src/domain/offers";
import { cardBodyClass, metaClass } from "@/design";

export default function OfferSummaryCard({ offer }: { offer: Offer }) {
  return (
    <SectionCard title={offer.number}>
      <p className={cardBodyClass}>{offer.title}</p>
      <div className="mt-3">
        <StatusBadge label={offer.status} tone={statusTone(offer.status)} />
      </div>
      <p className={`mt-3 ${metaClass}`}>
        {offer.total} {offer.currency} · veljavno do {offer.validUntil ?? "—"}
      </p>
    </SectionCard>
  );
}

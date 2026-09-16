import type { OfferRevision } from "@/src/domain/offers";
import { cardBodyClass, metaClass } from "@/design";

export default function OfferRevisionList({ revisions }: { revisions: OfferRevision[] }) {
  if (revisions.length === 0) {
    return <p className={metaClass}>Ni revizij.</p>;
  }
  return (
    <ul className="space-y-2">
      {revisions.map((item) => (
        <li key={item.id} className={cardBodyClass}>
          R{item.revisionNumber} · {item.changeSummary} · {item.changedBy}
        </li>
      ))}
    </ul>
  );
}

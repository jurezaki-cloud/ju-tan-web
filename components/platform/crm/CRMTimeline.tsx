import type { CrmTimelineEntry } from "@/src/types/crm";
import { cardBodyClass, metaClass } from "@/design";

export default function CRMTimeline({ entries }: { entries: CrmTimelineEntry[] }) {
  if (entries.length === 0) {
    return <p className={metaClass}>Ni dogodkov na časovnici.</p>;
  }
  return (
    <ol className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id} className="border-l border-white/10 pl-4 light:border-slate-200">
          <p className={metaClass}>{entry.at}</p>
          <p className={cardBodyClass}>{entry.title}</p>
          {entry.subtitle ? <p className={metaClass}>{entry.subtitle}</p> : null}
        </li>
      ))}
    </ol>
  );
}

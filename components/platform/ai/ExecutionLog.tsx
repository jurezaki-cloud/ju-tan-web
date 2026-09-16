import { cardSurface, headingCard, metaClass } from "@/design";
import type { ExecutionLogEntry } from "@/src/ai/actions/types";

export default function ExecutionLog({ entries }: { entries: ExecutionLogEntry[] }) {
  return (
    <section className={`${cardSurface} p-4`}>
      <h3 className={`${headingCard} text-[16px]`}>Izvedba</h3>
      <ol className="mt-3 space-y-2">
        {entries.map((entry, index) => (
          <li key={`${entry.at}-${index}`}>
            <p className="text-[14px] text-white light:text-slate-900">{entry.message}</p>
            <p className={metaClass}>
              {entry.at}
              {entry.tool ? ` · ${entry.tool}` : ""}
              {entry.provider ? ` · ${entry.provider}` : ""}
              {entry.durationMs !== undefined ? ` · ${entry.durationMs} ms` : ""}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

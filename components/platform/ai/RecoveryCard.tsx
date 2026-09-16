import { cardSurface, headingCard, cardBodyClass, metaClass } from "@/design";
import type { RecoveryRecord } from "@/src/ai/agent/types";

export default function RecoveryCard({ recovery }: { recovery: RecoveryRecord }) {
  return (
    <article className={`${cardSurface} p-4`}>
      <h2 className={`${headingCard} text-[16px]`}>Obnova</h2>
      <p className={`mt-2 ${cardBodyClass}`}>Napaka: {recovery.error}</p>
      <ol className="mt-3 space-y-2">
        {recovery.attempts.map((item) => (
          <li key={item.attempt}>
            <p className="text-[14px] text-white light:text-slate-900">
              Poskus {item.attempt} · {item.strategy}
            </p>
            <p className={metaClass}>{item.note}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}

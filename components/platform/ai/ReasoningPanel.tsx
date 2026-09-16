import { cardSurface, headingCard, metaClass, cardBodyClass } from "@/design";
import type { ReasoningTrace } from "@/src/ai/agent/types";

export default function ReasoningPanel({ thinking }: { thinking: ReasoningTrace }) {
  return (
    <section className={`${cardSurface} p-4`} aria-label="Razmišljanje">
      <h2 className={`${headingCard} text-[16px]`}>Razmišljanje</h2>
      <p className={`mt-2 ${cardBodyClass}`}>{thinking.reason}</p>
      <p className={`mt-2 ${metaClass}`}>Confidence {Math.round(thinking.confidence * 100)}%</p>
      <p className={`mt-2 ${metaClass}`}>Tveganja: {thinking.risks.join("; ")}</p>
    </section>
  );
}

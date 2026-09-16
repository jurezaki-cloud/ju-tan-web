import { cardSurface, headingCard, cardBodyClass, metaClass } from "@/design";
import type { Reflection } from "@/src/ai/agent/types";

export default function ReflectionCard({ reflection }: { reflection: Reflection }) {
  return (
    <article className={`${cardSurface} p-4`}>
      <h2 className={`${headingCard} text-[16px]`}>Refleksija</h2>
      <p className={`mt-2 ${cardBodyClass}`}>Narejeno: {reflection.succeeded}</p>
      <p className={`mt-1 ${cardBodyClass}`}>Bolje: {reflection.improve}</p>
      <p className={`mt-2 ${metaClass}`}>{reflection.at}</p>
    </article>
  );
}

import { cardSurface, headingCard, cardBodyClass, metaClass } from "@/design";
import type { AiArtifact } from "@/src/ai/types";
import StatusBadge from "@/components/platform/StatusBadge";

export default function ArtifactCard({ artifact }: { artifact: AiArtifact }) {
  return (
    <article className={`${cardSurface} p-4`}>
      <StatusBadge label={artifact.kind} />
      <h3 className={`${headingCard} mt-3 text-[16px]`}>{artifact.title}</h3>
      <p className={`mt-1 ${cardBodyClass}`}>{artifact.summary}</p>
      <p className={`mt-2 ${metaClass}`}>Mock datoteka — ni prenosa.</p>
    </article>
  );
}

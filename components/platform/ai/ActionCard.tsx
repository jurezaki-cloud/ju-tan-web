import { cardSurface, headingCard, cardBodyClass, metaClass } from "@/design";
import type { Action } from "@/src/ai/actions/types";
import ActionStatusBadge from "./ActionStatusBadge";

export default function ActionCard({ action }: { action: Action }) {
  return (
    <article className={`${cardSurface} p-4`}>
      <div className="flex flex-wrap items-center gap-2">
        <ActionStatusBadge status={action.status} />
        <span className={metaClass}>{action.category}</span>
        <span className={metaClass}>{action.estimatedDuration}</span>
      </div>
      <h3 className={`${headingCard} mt-3 text-[16px]`}>{action.title}</h3>
      <p className={`mt-1 ${cardBodyClass}`}>{action.description}</p>
      <p className={`mt-2 ${metaClass}`}>
        {action.actor.agentId} · {action.actor.providerId}
        {action.artifactIds.length > 0 ? ` · ${action.artifactIds.length} artefaktov` : ""}
      </p>
    </article>
  );
}

import { cardSurface, headingCard, cardBodyClass, metaClass } from "@/design";
import type { DelegationRecord } from "@/src/ai/agent/types";
import StatusBadge from "@/components/platform/StatusBadge";

function tone(status: DelegationRecord["status"]) {
  if (status === "Completed") return "success" as const;
  if (status === "Failed") return "caution" as const;
  return "neutral" as const;
}

export default function DelegationCard({ delegation }: { delegation: DelegationRecord }) {
  return (
    <article className={`${cardSurface} p-4`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className={`${headingCard} text-[16px]`}>Delegacija</h2>
        <StatusBadge label={delegation.status} tone={tone(delegation.status)} />
      </div>
      <p className={`mt-2 ${cardBodyClass}`}>
        Agent: {delegation.agent}. {delegation.task}
      </p>
      <p className={`mt-1 ${metaClass}`}>{delegation.id}</p>
    </article>
  );
}

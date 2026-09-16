import { cardSurface, headingCard, metaClass, cardBodyClass } from "@/design";
import type { Goal } from "@/src/ai/agent/types";
import StatusBadge from "@/components/platform/StatusBadge";

function tone(status: Goal["status"]) {
  if (status === "Completed") return "success" as const;
  if (status === "Failed" || status === "Cancelled") return "caution" as const;
  return "neutral" as const;
}

export default function GoalPanel({ goal }: { goal: Goal }) {
  return (
    <section className={`${cardSurface} p-4`} aria-label="Cilj">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label={goal.status} tone={tone(goal.status)} />
        <span className={metaClass}>{goal.workspace}</span>
      </div>
      <h2 className={`${headingCard} mt-3 text-[16px]`}>{goal.title}</h2>
      <p className={`mt-1 ${cardBodyClass}`}>{goal.description}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        <div>
          <dt className={metaClass}>Napredek</dt>
          <dd className="text-[14px] text-white light:text-slate-900">{goal.progress}%</dd>
        </div>
        <div>
          <dt className={metaClass}>Preostalo</dt>
          <dd className="text-[14px] text-white light:text-slate-900">{goal.remaining}</dd>
        </div>
        <div>
          <dt className={metaClass}>ETA</dt>
          <dd className="text-[14px] text-white light:text-slate-900">{goal.eta}</dd>
        </div>
      </dl>
      <div className="mt-3 h-2 overflow-hidden rounded-lg border border-white/10 light:border-slate-200">
        <div className="h-full bg-[#16a34a]" style={{ width: `${goal.progress}%` }} />
      </div>
    </section>
  );
}

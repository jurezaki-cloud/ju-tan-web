import { headingCard, cardBodyClass, numberBadgeClass, metaClass } from "@/design";
import type { Action } from "@/src/ai/actions/types";
import StatusBadge from "@/components/platform/StatusBadge";

function stepTone(status: string) {
  if (status === "Completed") return "success" as const;
  if (status === "Failed" || status === "Blocked") return "caution" as const;
  return "neutral" as const;
}

export default function ActionTimeline({ action }: { action: Action }) {
  return (
    <section>
      <h2 className={headingCard}>{action.title}</h2>
      <ol className="mt-6 space-y-0">
        {action.steps.map((step, index) => (
          <li key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={numberBadgeClass}>{String(index + 1).padStart(2, "0")}</span>
              {index < action.steps.length - 1 ? (
                <span className="my-1 w-px flex-1 bg-white/10 light:bg-slate-200" aria-hidden />
              ) : null}
            </div>
            <div className="pb-8">
              <p className="font-medium text-white light:text-slate-900">{step.title}</p>
              <p className={`mt-1 ${cardBodyClass}`}>{step.reason}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge label={step.status} tone={stepTone(step.status)} />
                <span className={metaClass}>{step.estimatedTime}</span>
                {step.toolId ? <span className={metaClass}>{step.toolId}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

import { headingCard, cardBodyClass, numberBadgeClass } from "@/design";
import type { Workflow } from "@/src/ai/types";

export default function WorkflowTimeline({ workflow }: { workflow: Workflow }) {
  return (
    <section>
      <h2 className={headingCard}>{workflow.title}</h2>
      <ol className="mt-6 space-y-0">
        {workflow.steps.map((step, index) => (
          <li key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={numberBadgeClass}>{String(index + 1).padStart(2, "0")}</span>
              {index < workflow.steps.length - 1 ? (
                <span
                  className="my-1 w-px flex-1 bg-white/10 light:bg-slate-200"
                  aria-hidden
                />
              ) : null}
            </div>
            <div className="pb-8">
              <p className="font-medium text-white light:text-slate-900">{step.label}</p>
              {index < workflow.steps.length - 1 ? (
                <p className={`mt-1 ${cardBodyClass}`}>Naslednji korak v toku.</p>
              ) : (
                <p className={`mt-1 ${cardBodyClass}`}>Zadnji korak toka.</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

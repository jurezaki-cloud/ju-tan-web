import ProcessCard from "./ProcessCard";
import { process } from "@/lib/data/process";
import { cn } from "@/lib/utils";

export default function ProcessTimeline() {
  return (
    <ol className="relative flex list-none flex-col gap-12 lg:gap-14">
      <span
        className="pointer-events-none absolute top-8 bottom-8 left-8 w-px -translate-x-1/2 bg-white/10 lg:left-1/2 light:bg-slate-200"
        aria-hidden
      />

      {process.map((step, index) => {
        const cardRight = index % 2 === 0;
        const Icon = step.icon;

        return (
          <li
            key={step.number}
            className="relative grid grid-cols-[64px_minmax(0,1fr)] items-center gap-4 lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] lg:gap-8"
          >
            <div className="relative z-10 col-start-1 flex justify-center lg:col-start-2">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#16a34a]/40 bg-[#050816] text-[#16a34a] light:bg-white">
                <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden />
              </span>
            </div>

            <p
              className={cn(
                "pointer-events-none hidden font-heading text-4xl font-bold tabular-nums tracking-[-0.04em] text-white/10 lg:block",
                cardRight
                  ? "col-start-1 row-start-1 justify-self-end pr-2"
                  : "col-start-3 row-start-1 justify-self-start pl-2",
              )}
              aria-hidden
            >
              {step.number}
            </p>

            <div
              className={cn(
                "col-start-2 min-w-0 lg:row-start-1",
                cardRight ? "lg:col-start-3" : "lg:col-start-1",
              )}
            >
              <ProcessCard
                number={step.number}
                title={step.title}
                description={step.description}
                stack={step.stack}
                align={cardRight ? "left" : "right"}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

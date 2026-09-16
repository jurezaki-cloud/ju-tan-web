import { cardSurface, headingCard, numberBadgeClass } from "@/design";
import type { ExecutionPhase } from "@/src/ai/agent/mock";
import StatusBadge from "@/components/platform/StatusBadge";

export default function ExecutionTimeline({ phases }: { phases: ExecutionPhase[] }) {
  return (
    <section className={`${cardSurface} p-4`} aria-label="Izvedba">
      <h2 className={`${headingCard} text-[16px]`}>Izvedba</h2>
      <ol className="mt-4 space-y-3">
        {phases.map((phase, index) => (
          <li key={phase.id} className="flex items-center gap-3">
            <span className={numberBadgeClass}>{String(index + 1).padStart(2, "0")}</span>
            <span className="flex-1 text-[14px] text-white light:text-slate-900">{phase.label}</span>
            <StatusBadge
              label={phase.state}
              tone={phase.state === "done" ? "success" : phase.state === "current" ? "caution" : "neutral"}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

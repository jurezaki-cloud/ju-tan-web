import { cardSurface, headingCard, metaClass } from "@/design";
import type { Job } from "@/src/ai/jobs/types";
import StatusBadge from "@/components/platform/StatusBadge";

function tone(status: Job["status"]) {
  if (status === "Completed") return "success" as const;
  if (status === "Failed" || status === "Cancelled") return "caution" as const;
  return "neutral" as const;
}

export default function JobProgress({ job }: { job: Job }) {
  return (
    <article className={`${cardSurface} p-4`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className={`${headingCard} text-[16px]`}>Job {job.id}</h3>
        <StatusBadge label={job.status} tone={tone(job.status)} />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-lg border border-white/10 light:border-slate-200">
        <div className="h-full bg-[#16a34a]" style={{ width: `${job.progress}%` }} />
      </div>
      <p className={`mt-2 ${metaClass}`}>{job.progress}%</p>
    </article>
  );
}

import type { ScheduleKind, ScheduledJob } from "../types";

export class MockScheduler {
  constructor(
    private readonly jobs: ScheduledJob[] = [],
    private seq = 0,
    private readonly now: () => Date = () => new Date(),
  ) {}

  schedule(goalId: string, kind: ScheduleKind): ScheduledJob {
    const runAt = this.resolve(kind);
    const job: ScheduledJob = {
      id: `sch-${++this.seq}`,
      goalId,
      kind,
      runAt,
      status: "Scheduled",
    };
    this.jobs.push(job);
    return { ...job };
  }

  list(goalId?: string): ScheduledJob[] {
    return this.jobs.filter((item) => (goalId ? item.goalId === goalId : true)).map((item) => ({ ...item }));
  }

  cancel(id: string): void {
    const job = this.jobs.find((item) => item.id === id);
    if (job) job.status = "Cancelled";
  }

  private resolve(kind: ScheduleKind): string {
    const base = this.now().getTime();
    const offset: Record<ScheduleKind, number> = {
      later: 2 * 60 * 60 * 1000,
      tomorrow: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      recurring: 7 * 24 * 60 * 60 * 1000,
      "after-approval": 0,
      "after-event": 0,
    };
    return new Date(base + offset[kind]).toISOString();
  }
}

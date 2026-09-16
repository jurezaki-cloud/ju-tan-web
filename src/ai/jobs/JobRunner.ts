import type { Job, JobStatus } from "./types";

export interface JobStore {
  get(id: string): Promise<Job | undefined>;
  save(job: Job): Promise<void>;
  list(actionId?: string): Promise<Job[]>;
}

export class InMemoryJobStore implements JobStore {
  constructor(private readonly rows = new Map<string, Job>()) {}

  async get(id: string): Promise<Job | undefined> {
    const row = this.rows.get(id);
    return row ? structuredClone(row) : undefined;
  }

  async save(job: Job): Promise<void> {
    this.rows.set(job.id, structuredClone(job));
  }

  async list(actionId?: string): Promise<Job[]> {
    return [...this.rows.values()]
      .filter((row) => (actionId ? row.actionId === actionId : true))
      .map((row) => structuredClone(row));
  }
}

export class JobRunner {
  constructor(
    private readonly store: JobStore = new InMemoryJobStore(),
    private readonly now: () => Date = () => new Date(),
    private readonly nextId: () => string = () => `job-${this.now().getTime()}`,
  ) {}

  async enqueue(actionId: string): Promise<Job> {
    const job: Job = {
      id: this.nextId(),
      actionId,
      status: "Queued",
      progress: 0,
      createdAt: this.now().toISOString(),
      updatedAt: this.now().toISOString(),
    };
    await this.store.save(job);
    return job;
  }

  async setStatus(id: string, status: JobStatus, progress: number, error?: string): Promise<Job> {
    const job = await this.store.get(id);
    if (!job) {
      throw new Error("Job ni najden.");
    }
    const next: Job = {
      ...job,
      status,
      progress,
      error,
      updatedAt: this.now().toISOString(),
    };
    await this.store.save(next);
    return next;
  }

  async get(id: string): Promise<Job | undefined> {
    return this.store.get(id);
  }
}

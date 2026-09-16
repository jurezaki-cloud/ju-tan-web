export type JobStatus = "Queued" | "Running" | "Completed" | "Failed" | "Cancelled";

export type Job = {
  id: string;
  actionId: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
};

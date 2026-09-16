export type ActionStatus =
  | "Pending"
  | "Planning"
  | "WaitingApproval"
  | "Running"
  | "Completed"
  | "Failed"
  | "Cancelled";

export type ActionPriority = "low" | "normal" | "high";

export type ActionCategory = "sales" | "crm" | "project" | "erp" | "docs" | "engineering" | "automation";

export type ActionType =
  | "create-lead"
  | "create-client"
  | "create-project"
  | "create-offer"
  | "create-invoice"
  | "generate-pdf"
  | "generate-documentation"
  | "generate-sql"
  | "generate-api-spec"
  | "generate-diagram"
  | "run-automation"
  | "search-knowledge"
  | "analyze-website"
  | "analyze-repository"
  | "find-client"
  | "find-lead"
  | "list-open-tasks"
  | "search-documents"
  | "summarize-document"
  | "link-artifact"
  | "prepare-knowledge"
  | "prepare-notification"
  | "global-search"
  | "list-activities"
  | "list-quotes"
  | "read-document"
  | "resolve-artifact";

export type ActionStepStatus = "Pending" | "Running" | "Completed" | "Failed" | "Skipped" | "Blocked";

export type ActionStep = {
  id: string;
  title: string;
  toolId?: string;
  artifactKind?: string;
  reason: string;
  estimatedTime: string;
  requiresApproval: boolean;
  status: ActionStepStatus;
  result?: unknown;
};

export type ActionActor = {
  userId: string;
  agentId: string;
  providerId: string;
  workflowId?: string;
};

export type ActionTrace = {
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
  tool?: string;
  provider?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

export type ExecutionLogEntry = {
  at: string;
  message: string;
  tool?: string;
  provider?: string;
  durationMs?: number;
};

export type Action = {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  category: ActionCategory;
  status: ActionStatus;
  priority: ActionPriority;
  estimatedDuration: string;
  requiresApproval: boolean;
  steps: ActionStep[];
  result?: unknown;
  error?: string;
  artifactIds: string[];
  jobId?: string;
  approvalId?: string;
  actor: ActionActor;
  command: string;
  payload: Record<string, unknown>;
  logs: ExecutionLogEntry[];
  createdAt: string;
  updatedAt: string;
  trace: ActionTrace;
};

export type Plan = {
  type: ActionType;
  title: string;
  description: string;
  category: ActionCategory;
  estimatedDuration: string;
  requiresApproval: boolean;
  steps: ActionStep[];
};

export type PlanRequest = {
  command: string;
  actor: ActionActor;
  input?: Record<string, unknown>;
  type?: ActionType;
};

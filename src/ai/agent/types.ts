export type AgentState =
  | "Idle"
  | "Planning"
  | "Reasoning"
  | "Running"
  | "WaitingApproval"
  | "WaitingUser"
  | "Paused"
  | "Recovering"
  | "Completed"
  | "Cancelled"
  | "Failed";

export type GoalPriority = "low" | "normal" | "high";

export type GoalStatus =
  | "Draft"
  | "Active"
  | "WaitingApproval"
  | "Paused"
  | "Completed"
  | "Cancelled"
  | "Failed";

export type AgentPhase =
  | "Planner"
  | "Reasoning"
  | "Execution"
  | "Artifacts"
  | "Reflection"
  | "Finish";

export type DelegateAgentId =
  | "crm"
  | "sales"
  | "erp"
  | "developer"
  | "support"
  | "automation"
  | "knowledge"
  | "repository";

export type SkillId =
  | "create-offer"
  | "website-audit"
  | "crm-analysis"
  | "repository-review"
  | "generate-api"
  | "generate-sql"
  | "generate-pdf"
  | "business-analysis"
  | "marketing-campaign"
  | "integration-analysis";

export type ReasoningTrace = {
  reason: string;
  confidence: number;
  alternatives: string[];
  risks: string[];
  estimatedTime: string;
  dependencies: string[];
};

export type GoalStep = {
  id: string;
  title: string;
  skillId?: SkillId;
  actionId?: string;
  delegate?: DelegateAgentId;
  reasoning: ReasoningTrace;
  status: "Pending" | "Running" | "Completed" | "Failed" | "Blocked";
};

export type GoalHistoryEntry = {
  at: string;
  text: string;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  priority: GoalPriority;
  deadline?: string;
  status: GoalStatus;
  owner: string;
  workspace: string;
  progress: number;
  remaining: string;
  eta: string;
  steps: GoalStep[];
  artifacts: string[];
  history: GoalHistoryEntry[];
  command: string;
  createdAt: string;
  updatedAt: string;
};

export type Reflection = {
  id: string;
  goalId: string;
  stepId?: string;
  succeeded: string;
  failed: string;
  improve: string;
  continue: boolean;
  at: string;
};

export type RecoveryAttempt = {
  attempt: number;
  strategy: "retry" | "fallback" | "alternative-tool" | "manual-approval" | "continue";
  note: string;
};

export type RecoveryRecord = {
  id: string;
  goalId: string;
  error: string;
  attempts: RecoveryAttempt[];
  resolved: boolean;
};

export type DelegationRecord = {
  id: string;
  goalId: string;
  agent: DelegateAgentId;
  task: string;
  status: "Queued" | "Running" | "Completed" | "Failed";
};

export type ScheduleKind = "later" | "tomorrow" | "weekly" | "recurring" | "after-approval" | "after-event";

export type ScheduledJob = {
  id: string;
  goalId: string;
  kind: ScheduleKind;
  runAt: string;
  status: "Scheduled" | "Fired" | "Cancelled";
};

export type AgentContext = {
  currentUserId?: string;
  role?: string;
  workspace: string;
  project: string;
  client: string;
  conversationId?: string;
  openDocuments: string[];
  knowledgeCollections: string[];
};

export type AgentEventType =
  | "GoalCreated"
  | "GoalCompleted"
  | "GoalCancelled"
  | "PlanningStarted"
  | "PlanningFinished"
  | "ReasoningStarted"
  | "ReasoningFinished"
  | "ReflectionCompleted"
  | "RecoveryStarted"
  | "RecoveryFinished"
  | "DelegationStarted"
  | "DelegationFinished";

export type AgentEvent = {
  type: AgentEventType;
  at: string;
  goalId?: string;
  payload?: Record<string, unknown>;
};

export type StreamChunk = {
  phase: AgentPhase;
  message: string;
  goalId: string;
};

export type WorkflowCondition = {
  field: string;
  equals?: unknown;
  exists?: boolean;
};

export type WorkflowStepDefinition = {
  id: string;
  label: string;
  toolId?: string;
  promptId?: string;
  condition?: WorkflowCondition;
};

export type WorkflowDefinition = {
  id: string;
  title: string;
  steps: WorkflowStepDefinition[];
};

export type WorkflowStepResult = {
  stepId: string;
  skipped: boolean;
  toolId?: string;
  result?: unknown;
};

export type WorkflowRunResult = {
  workflowId: string;
  steps: WorkflowStepResult[];
  result: unknown;
};

export class AIError extends Error {
  readonly code: string;
  constructor(message: string, code = "AI_ERROR") {
    super(message);
    this.name = "AIError";
    this.code = code;
  }
}

export class ToolError extends AIError {
  readonly toolId: string;
  constructor(toolId: string, message: string) {
    super(message, "TOOL_ERROR");
    this.name = "ToolError";
    this.toolId = toolId;
  }
}

export class ProviderError extends AIError {
  readonly providerId: string;
  constructor(providerId: string, message: string) {
    super(message, "PROVIDER_ERROR");
    this.name = "ProviderError";
    this.providerId = providerId;
  }
}

export class WorkflowError extends AIError {
  readonly workflowId: string;
  constructor(workflowId: string, message: string) {
    super(message, "WORKFLOW_ERROR");
    this.name = "WorkflowError";
    this.workflowId = workflowId;
  }
}

export class ValidationError extends AIError {
  readonly field?: string;
  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.field = field;
  }
}

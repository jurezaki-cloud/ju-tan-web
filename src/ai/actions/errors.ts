import { AIError } from "@/src/ai/types/errors";

export class ActionError extends AIError {
  readonly actionId?: string;
  constructor(message: string, actionId?: string) {
    super(message, "ACTION_ERROR");
    this.name = "ActionError";
    this.actionId = actionId;
  }
}

export class ApprovalRequiredError extends AIError {
  readonly actionId: string;
  constructor(actionId: string, message = "Akcija čaka na odobritev.") {
    super(message, "APPROVAL_REQUIRED");
    this.name = "ApprovalRequiredError";
    this.actionId = actionId;
  }
}

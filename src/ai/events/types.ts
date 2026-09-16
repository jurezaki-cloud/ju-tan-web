export type ActionEventType =
  | "ActionCreated"
  | "ActionStarted"
  | "ActionCompleted"
  | "ActionFailed"
  | "ApprovalRequested"
  | "ApprovalGranted"
  | "ArtifactCreated"
  | "WorkflowCompleted";

export type ActionEvent = {
  type: ActionEventType;
  at: string;
  actionId?: string;
  payload?: Record<string, unknown>;
};

export type ActionEventHandler = (event: ActionEvent) => void;

export interface EventBus {
  emit(event: ActionEvent): void;
  on(type: ActionEventType, handler: ActionEventHandler): () => void;
}

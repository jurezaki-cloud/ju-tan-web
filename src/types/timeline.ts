export type TimelineKind =
  | "lead-created"
  | "client-created"
  | "note-added"
  | "activity-completed"
  | "opportunity-stage-changed"
  | "task-due"
  | "ai-action-completed"
  | "audit"
  | "document-added"
  | "quote-created"
  | "project-updated"
  | "artifact-linked"
  | "ai-summary"
  | "approval";

export type TimelineEntry = {
  id: string;
  at: string;
  kind: TimelineKind;
  title: string;
  subtitle?: string;
  clientId?: string;
  documentId?: string;
  artifactId?: string;
  metadata?: Record<string, unknown>;
};

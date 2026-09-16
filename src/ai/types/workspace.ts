export type AiProviderId =
  | "openai"
  | "azure-openai"
  | "anthropic"
  | "google-gemini"
  | "local";

export type AiAgentId =
  | "general"
  | "sales"
  | "crm"
  | "erp"
  | "project"
  | "automation"
  | "developer";

export type AiWorkspaceId =
  | "dashboard"
  | "chat"
  | "sales"
  | "crm"
  | "erp"
  | "project"
  | "automation"
  | "developer"
  | "knowledge";

export type AiStatus =
  | "Ready"
  | "Thinking"
  | "Working"
  | "Generating"
  | "Completed"
  | "Error";

export type AiMessageKind =
  | "text"
  | "markdown"
  | "table"
  | "code"
  | "warning"
  | "success"
  | "artifact";

export type ArtifactKind =
  | "PDF"
  | "Word"
  | "Excel"
  | "Markdown"
  | "JSON"
  | "SQL"
  | "API Spec"
  | "Diagram";

export type AiRole = "user" | "assistant";

export type AiTablePayload = {
  headers: string[];
  rows: string[][];
};

export type AiCodePayload = {
  language: string;
  content: string;
};

export type AiArtifact = {
  id: string;
  kind: ArtifactKind;
  title: string;
  summary: string;
};

export type AiMessage = {
  id: string;
  role: AiRole;
  time: string;
  status: AiStatus;
  kind: AiMessageKind;
  body: string;
  table?: AiTablePayload;
  code?: AiCodePayload;
  artifact?: AiArtifact;
};

export type AiAgent = {
  id: AiAgentId;
  name: string;
  description: string;
  workspace: AiWorkspaceId;
  providerId: AiProviderId;
  model: string;
  tools: string[];
  knowledgeCollections: string[];
};

export type AiActivityItem = {
  id: string;
  time: string;
  text: string;
};

export type AiContext = {
  project: string;
  client: string;
  attachments: string[];
  history: string[];
};

export type KnowledgeItem = {
  id: string;
  title: string;
  collection: string;
  summary: string;
};

export type WorkflowStep = {
  id: string;
  label: string;
};

export type Workflow = {
  id: string;
  title: string;
  steps: WorkflowStep[];
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  workspace: AiWorkspaceId;
  conversationId: string;
};

export type Suggestion = {
  id: string;
  label: string;
  href: string;
};

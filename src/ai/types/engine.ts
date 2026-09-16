import type { ChatResponse, ProviderChatMessage } from "./provider";
import type { ToolResult } from "./tool";

export type EngineRequestKind = "chat" | "tool" | "workflow" | "artifact";

export type EngineChatInput = {
  conversationId: string;
  messages: ProviderChatMessage[];
  systemPrompt?: string;
  model?: string;
};

export type EngineToolInput = {
  toolId: string;
  input: Record<string, unknown>;
  conversationId?: string;
  projectId?: string;
  clientId?: string;
};

export type EngineWorkflowInput = {
  workflowId: string;
  input: Record<string, unknown>;
};

export type EngineArtifactInput = {
  kind: string;
  title: string;
  payload: unknown;
};

export type EngineRequest =
  | { kind: "chat"; chat: EngineChatInput }
  | { kind: "tool"; tool: EngineToolInput }
  | { kind: "workflow"; workflow: EngineWorkflowInput }
  | { kind: "artifact"; artifact: EngineArtifactInput };

export type EngineResult = {
  kind: EngineRequestKind;
  output: unknown;
};

export type EngineChatResult = ChatResponse & { conversationId: string };

export type EngineToolRunResult = ToolResult & { toolId: string; durationMs: number };

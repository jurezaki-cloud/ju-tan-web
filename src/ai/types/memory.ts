import type { ProviderChatMessage } from "./provider";

export interface ConversationMemory {
  append(conversationId: string, message: ProviderChatMessage): Promise<void>;
  list(conversationId: string): Promise<ProviderChatMessage[]>;
}

export interface SessionMemory {
  get(sessionId: string, key: string): Promise<unknown>;
  set(sessionId: string, key: string, value: unknown): Promise<void>;
}

export interface ProjectMemory {
  get(projectId: string): Promise<Record<string, unknown>>;
  set(projectId: string, value: Record<string, unknown>): Promise<void>;
}

export interface ClientMemory {
  get(clientId: string): Promise<Record<string, unknown>>;
  set(clientId: string, value: Record<string, unknown>): Promise<void>;
}

export interface KnowledgeMemory {
  add(collection: string, id: string, text: string): Promise<void>;
  list(collection: string): Promise<{ id: string; text: string }[]>;
}

export type MemoryBundle = {
  conversation: ConversationMemory;
  session: SessionMemory;
  project: ProjectMemory;
  client: ClientMemory;
  knowledge: KnowledgeMemory;
};

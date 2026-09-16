import type {
  ClientMemory,
  ConversationMemory,
  KnowledgeMemory,
  MemoryBundle,
  ProjectMemory,
  SessionMemory,
} from "@/src/ai/types/memory";
import type { ProviderChatMessage } from "@/src/ai/types/provider";

export class InMemoryConversationMemory implements ConversationMemory {
  constructor(private readonly store = new Map<string, ProviderChatMessage[]>()) {}

  async append(conversationId: string, message: ProviderChatMessage): Promise<void> {
    const list = this.store.get(conversationId) ?? [];
    list.push(message);
    this.store.set(conversationId, list);
  }

  async list(conversationId: string): Promise<ProviderChatMessage[]> {
    return [...(this.store.get(conversationId) ?? [])];
  }
}

export class InMemorySessionMemory implements SessionMemory {
  constructor(private readonly store = new Map<string, Map<string, unknown>>()) {}

  async get(sessionId: string, key: string): Promise<unknown> {
    return this.store.get(sessionId)?.get(key);
  }

  async set(sessionId: string, key: string, value: unknown): Promise<void> {
    const bag = this.store.get(sessionId) ?? new Map<string, unknown>();
    bag.set(key, value);
    this.store.set(sessionId, bag);
  }
}

export class InMemoryProjectMemory implements ProjectMemory {
  constructor(private readonly store = new Map<string, Record<string, unknown>>()) {}

  async get(projectId: string): Promise<Record<string, unknown>> {
    return { ...(this.store.get(projectId) ?? {}) };
  }

  async set(projectId: string, value: Record<string, unknown>): Promise<void> {
    this.store.set(projectId, { ...value });
  }
}

export class InMemoryClientMemory implements ClientMemory {
  constructor(private readonly store = new Map<string, Record<string, unknown>>()) {}

  async get(clientId: string): Promise<Record<string, unknown>> {
    return { ...(this.store.get(clientId) ?? {}) };
  }

  async set(clientId: string, value: Record<string, unknown>): Promise<void> {
    this.store.set(clientId, { ...value });
  }
}

export class InMemoryKnowledgeMemory implements KnowledgeMemory {
  constructor(private readonly store = new Map<string, { id: string; text: string }[]>()) {}

  async add(collection: string, id: string, text: string): Promise<void> {
    const items = this.store.get(collection) ?? [];
    items.push({ id, text });
    this.store.set(collection, items);
  }

  async list(collection: string): Promise<{ id: string; text: string }[]> {
    return [...(this.store.get(collection) ?? [])];
  }
}

export function createMemoryBundle(): MemoryBundle {
  return {
    conversation: new InMemoryConversationMemory(),
    session: new InMemorySessionMemory(),
    project: new InMemoryProjectMemory(),
    client: new InMemoryClientMemory(),
    knowledge: new InMemoryKnowledgeMemory(),
  };
}

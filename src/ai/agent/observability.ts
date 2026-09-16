import type { AgentEvent, AgentEventType } from "./types";

export type AgentEventHandler = (event: AgentEvent) => void;

export class AgentEventBus {
  constructor(private readonly handlers = new Map<AgentEventType, Set<AgentEventHandler>>()) {}

  emit(event: AgentEvent): void {
    const set = this.handlers.get(event.type);
    if (!set) return;
    for (const handler of set) handler(event);
  }

  on(type: AgentEventType, handler: AgentEventHandler): () => void {
    const set = this.handlers.get(type) ?? new Set<AgentEventHandler>();
    set.add(handler);
    this.handlers.set(type, set);
    return () => set.delete(handler);
  }
}

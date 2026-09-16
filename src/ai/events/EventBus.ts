import type { ActionEvent, ActionEventHandler, ActionEventType, EventBus } from "./types";

export class InMemoryEventBus implements EventBus {
  constructor(private readonly handlers = new Map<ActionEventType, Set<ActionEventHandler>>()) {}

  emit(event: ActionEvent): void {
    const set = this.handlers.get(event.type);
    if (!set) return;
    for (const handler of set) handler(event);
  }

  on(type: ActionEventType, handler: ActionEventHandler): () => void {
    const set = this.handlers.get(type) ?? new Set<ActionEventHandler>();
    set.add(handler);
    this.handlers.set(type, set);
    return () => set.delete(handler);
  }
}

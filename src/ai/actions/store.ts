import type { Action } from "@/src/ai/actions/types";

export interface ActionStore {
  get(id: string): Promise<Action | undefined>;
  save(action: Action): Promise<void>;
  list(filter?: { userId?: string; agentId?: string; status?: string }): Promise<Action[]>;
}

export class InMemoryActionStore implements ActionStore {
  constructor(private readonly rows = new Map<string, Action>()) {}

  async get(id: string): Promise<Action | undefined> {
    const row = this.rows.get(id);
    return row ? structuredClone(row) : undefined;
  }

  async save(action: Action): Promise<void> {
    this.rows.set(action.id, structuredClone(action));
  }

  async list(filter?: { userId?: string; agentId?: string; status?: string }): Promise<Action[]> {
    return [...this.rows.values()]
      .filter((row) => (filter?.userId ? row.actor.userId === filter.userId : true))
      .filter((row) => (filter?.agentId ? row.actor.agentId === filter.agentId : true))
      .filter((row) => (filter?.status ? row.status === filter.status : true))
      .map((row) => structuredClone(row));
  }
}

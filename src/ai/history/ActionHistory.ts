import type { ActionHistoryRecord } from "./types";

export interface ActionHistory {
  append(record: ActionHistoryRecord): Promise<void>;
  list(actionId?: string): Promise<ActionHistoryRecord[]>;
}

export class InMemoryActionHistory implements ActionHistory {
  constructor(private readonly rows: ActionHistoryRecord[] = []) {}

  async append(record: ActionHistoryRecord): Promise<void> {
    this.rows.push(structuredClone(record));
  }

  async list(actionId?: string): Promise<ActionHistoryRecord[]> {
    return this.rows
      .filter((row) => (actionId ? row.actionId === actionId : true))
      .map((row) => structuredClone(row));
  }
}

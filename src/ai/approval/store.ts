import type { Approval } from "./policy";

export interface ApprovalStore {
  get(id: string): Promise<Approval | undefined>;
  byAction(actionId: string): Promise<Approval | undefined>;
  save(approval: Approval): Promise<void>;
}

export class InMemoryApprovalStore implements ApprovalStore {
  constructor(private readonly rows = new Map<string, Approval>()) {}

  async get(id: string): Promise<Approval | undefined> {
    const row = this.rows.get(id);
    return row ? structuredClone(row) : undefined;
  }

  async byAction(actionId: string): Promise<Approval | undefined> {
    const row = [...this.rows.values()].find((item) => item.actionId === actionId);
    return row ? structuredClone(row) : undefined;
  }

  async save(approval: Approval): Promise<void> {
    this.rows.set(approval.id, structuredClone(approval));
  }
}

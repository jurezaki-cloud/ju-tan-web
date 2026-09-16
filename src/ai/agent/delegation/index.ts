import type { MCPClientAdapter } from "@/src/ai/types/mcp";
import type { DelegateAgentId, DelegationRecord } from "../types";

export class DelegationService {
  constructor(
    private readonly mcp?: MCPClientAdapter,
    private readonly records: DelegationRecord[] = [],
    private seq = 0,
  ) {}

  start(goalId: string, agent: DelegateAgentId, task: string): DelegationRecord {
    const record: DelegationRecord = {
      id: `del-${++this.seq}`,
      goalId,
      agent,
      task,
      status: "Running",
    };
    this.records.push(record);
    return { ...record };
  }

  finish(id: string, status: DelegationRecord["status"]): DelegationRecord | undefined {
    const record = this.records.find((item) => item.id === id);
    if (!record) return undefined;
    record.status = status;
    return { ...record };
  }

  async mcpTools(): Promise<string[]> {
    if (!this.mcp) return [];
    const listed = await this.mcp.listTools();
    return listed.map((item) => item.name);
  }

  list(goalId?: string): DelegationRecord[] {
    return this.records.filter((item) => (goalId ? item.goalId === goalId : true)).map((item) => ({ ...item }));
  }
}

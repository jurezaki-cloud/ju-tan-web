export type ActionHistoryRecord = {
  id: string;
  actionId: string;
  at: string;
  userId: string;
  agentId: string;
  durationMs?: number;
  result?: unknown;
  artifactIds: string[];
  status: string;
};

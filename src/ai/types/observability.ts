export type AIEvent = {
  type: string;
  at: string;
  payload?: Record<string, unknown>;
};

export type ToolExecution = {
  toolId: string;
  startedAt: string;
  durationMs: number;
  ok: boolean;
  error?: string;
};

export interface Logger {
  info(message: string, payload?: Record<string, unknown>): void;
  warn(message: string, payload?: Record<string, unknown>): void;
  error(message: string, payload?: Record<string, unknown>): void;
}

export interface AuditLog {
  record(event: AIEvent): void;
  list(): AIEvent[];
}

import type { AIEvent, AuditLog, Logger, ToolExecution } from "@/src/ai/types/observability";

export class ConsoleLogger implements Logger {
  info(message: string, payload?: Record<string, unknown>): void {
    void payload;
    void message;
  }

  warn(message: string, payload?: Record<string, unknown>): void {
    void payload;
    void message;
  }

  error(message: string, payload?: Record<string, unknown>): void {
    void payload;
    void message;
  }
}

export class InMemoryAuditLog implements AuditLog {
  constructor(private readonly events: AIEvent[] = []) {}

  record(event: AIEvent): void {
    this.events.push(event);
  }

  list(): AIEvent[] {
    return [...this.events];
  }
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function timed<T>(run: () => Promise<T>): Promise<{ value: T; durationMs: number }> {
  const started = Date.now();
  return run().then((value) => ({ value, durationMs: Date.now() - started }));
}

export function toolExecution(
  toolId: string,
  durationMs: number,
  ok: boolean,
  error?: string,
): ToolExecution {
  return { toolId, startedAt: nowIso(), durationMs, ok, error };
}

import type { PersistenceTrace, ReadinessState } from "@/src/types/persistence";

export type PersistenceEventChannel = "metrics" | "audit" | "health";

export type PersistenceEvent = {
  channel: PersistenceEventChannel;
  name: string;
  at: string;
  durationMs?: number;
  detail?: Record<string, string | number | boolean | undefined>;
};

export class PersistenceEvents {
  constructor(private readonly events: PersistenceEvent[] = []) {}

  emit(channel: PersistenceEventChannel, name: string, detail?: PersistenceEvent["detail"], durationMs?: number): void {
    this.events.push({
      channel,
      name,
      at: new Date().toISOString(),
      durationMs,
      detail,
    });
  }

  metrics(): PersistenceEvent[] {
    return this.events.filter((item) => item.channel === "metrics");
  }

  audit(): PersistenceEvent[] {
    return this.events.filter((item) => item.channel === "audit");
  }

  health(): PersistenceEvent[] {
    return this.events.filter((item) => item.channel === "health");
  }

  list(): PersistenceEvent[] {
    return [...this.events];
  }

  readiness(state: ReadinessState, fallback?: string): void {
    this.emit("health", "readiness", { state, fallback: fallback ?? "" });
  }

  fallback(reason: string): void {
    this.emit("audit", "fallback", { reason });
  }
}


export class PersistenceTracer {
  constructor(
    private readonly traces: PersistenceTrace[] = [],
    private readonly slowMs = 200,
  ) {}

  measure<T>(kind: PersistenceTrace["kind"], table: string | undefined, fn: () => T): T {
    const started = Date.now();
    try {
      const result = fn();
      this.record(kind, table, Date.now() - started);
      return result;
    } catch (error) {
      this.record(kind, table, Date.now() - started, error instanceof Error ? error.message : "error");
      throw error;
    }
  }

  async measureAsync<T>(kind: PersistenceTrace["kind"], table: string | undefined, fn: () => Promise<T>): Promise<T> {
    const started = Date.now();
    try {
      const result = await fn();
      this.record(kind, table, Date.now() - started);
      return result;
    } catch (error) {
      this.record(kind, table, Date.now() - started, error instanceof Error ? error.message : "error");
      throw error;
    }
  }

  slowQueries(): PersistenceTrace[] {
    return this.traces.filter((item) => item.slow);
  }

  list(): PersistenceTrace[] {
    return [...this.traces];
  }

  private record(kind: PersistenceTrace["kind"], table: string | undefined, durationMs: number, error?: string) {
    this.traces.push({
      kind,
      table,
      durationMs,
      slow: durationMs >= this.slowMs,
      error,
    });
  }
}

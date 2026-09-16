import type { PoolConfig } from "@/src/types/persistence";
import type { PostgresConnectionConfig } from "@/src/types/persistence";
import type { LiveQueryHandle } from "./types";

export function toPoolConfig(config: PostgresConnectionConfig): PoolConfig {
  return {
    max: config.poolSize,
    ssl: config.ssl,
    idleTimeoutMs: Math.max(1000, config.timeoutMs * 2),
  };
}

export class PostgresPool {
  constructor(
    readonly config: PoolConfig,
    private readonly handle?: LiveQueryHandle,
  ) {}

  get live(): boolean {
    return Boolean(this.handle);
  }

  async query(text: string, params?: unknown[]) {
    if (!this.handle) {
      return { rows: [] as Record<string, unknown>[], rowCount: 0 };
    }
    return this.handle.query(text, params as never);
  }

  async disconnect(): Promise<void> {
    await this.handle?.end?.();
  }
}

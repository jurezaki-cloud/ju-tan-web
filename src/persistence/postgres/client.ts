import type { PostgresQueryResult, SqlParam } from "@/src/types/postgres";
import { PostgresUnavailableError } from "./errors";
import type { LiveQueryHandle } from "./types";

export type { LiveQueryHandle };

export class PostgresClient {
  constructor(
    private readonly url?: string,
    private readonly handle?: LiveQueryHandle,
  ) {}

  async connect(): Promise<void> {
    if (this.handle?.connect) await this.handle.connect();
  }

  async disconnect(): Promise<void> {
    if (this.handle?.end) await this.handle.end();
  }

  async ping(): Promise<boolean> {
    if (!this.handle) return false;
    await this.handle.query("SELECT 1", []);
    return true;
  }

  async execute(sql: string, params: SqlParam[] = []): Promise<PostgresQueryResult> {
    if (!this.handle) throw new PostgresUnavailableError();
    const started = Date.now();
    const result = await this.handle.query(sql, params);
    return { rows: result.rows, rowCount: result.rowCount ?? result.rows.length, durationMs: Date.now() - started };
  }

  get live(): boolean {
    return Boolean(this.handle);
  }

  get databaseUrl(): string | undefined {
    return this.url;
  }
}

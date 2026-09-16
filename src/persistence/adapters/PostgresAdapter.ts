import type {
  DatabaseAdapter,
  PersistenceCommand,
  PersistenceMode,
  PersistenceQuery,
  QueryResult,
  TransactionHandle,
} from "@/src/types/persistence";
import { CompatiblePostgresDriver } from "../postgres/driver";
import { SqlQueryBuilder } from "../postgres/query-builder";
import { PostgresRowMapper } from "../postgres/mapper";
import type { SqlParam } from "@/src/types/postgres";

export class PostgresAdapter implements DatabaseAdapter {
  readonly mode: PersistenceMode = "postgres";
  private readonly builder = new SqlQueryBuilder();
  private readonly rows = new PostgresRowMapper();

  constructor(private readonly driver: CompatiblePostgresDriver) {}

  connect(): Promise<void> {
    return this.driver.connect();
  }

  disconnect(): Promise<void> {
    return this.driver.disconnect();
  }

  ping(): Promise<boolean> {
    return this.driver.ping();
  }

  transaction<T>(fn: (tx: TransactionHandle) => Promise<T>): Promise<T> {
    return this.driver.transaction(async (tx) => {
      const handle: TransactionHandle = {
        id: tx.id,
        query: async (command) => this.toResult(await tx.query(this.selectStmt(command))),
        command: async (command) => this.toResult(await tx.command(this.commandStmt(command))),
        commit: () => tx.commit(),
        rollback: () => tx.rollback(),
      };
      return fn(handle);
    });
  }

  async query(command: PersistenceQuery): Promise<QueryResult> {
    return this.toResult(await this.driver.query(this.selectStmt(command)));
  }

  async command(command: PersistenceCommand): Promise<QueryResult> {
    return this.toResult(await this.driver.command(this.commandStmt(command)));
  }

  private selectStmt(command: PersistenceQuery) {
    return this.builder.select(command.table, asFilters(command.filters), { includeDeleted: command.options?.includeDeleted });
  }

  private commandStmt(command: PersistenceCommand) {
    if (command.op === "insert" && command.row) {
      return this.builder.insert(command.table, this.rows.fromRecord(command.row));
    }
    if (command.op === "archive" || command.op === "delete") {
      return this.builder.softDelete(command.table, { id: command.id as SqlParam });
    }
    return this.builder.update(command.table, { id: command.id as SqlParam }, (command.patch ?? command.row ?? {}) as Record<string, unknown>, command.expectedVersion);
  }

  private toResult(result: { rows: Record<string, unknown>[]; rowCount: number; durationMs: number }): QueryResult {
    return {
      rows: result.rows.map((row) => this.rows.toRecord(row)),
      rowCount: result.rowCount,
      durationMs: result.durationMs,
    };
  }
}

function asFilters(filters?: Record<string, unknown>): Record<string, SqlParam | undefined> {
  const next: Record<string, SqlParam | undefined> = {};
  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value === undefined || value === null) next[key] = null;
    else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") next[key] = value;
  }
  return next;
}

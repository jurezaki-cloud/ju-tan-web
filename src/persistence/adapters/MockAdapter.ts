import type {
  DatabaseAdapter,
  PersistenceCommand,
  PersistenceMode,
  PersistenceQuery,
  QueryResult,
  TenantScope,
  TransactionHandle,
} from "@/src/types/persistence";
import type { PersistenceTable } from "../entities";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceTracer } from "../observability";
import { QueryError } from "../errors";

export class MockDatabaseAdapter implements DatabaseAdapter {
  readonly mode: PersistenceMode = "mock";

  constructor(
    readonly tables: InMemoryTables,
    private readonly scope: TenantScope,
    private readonly tracer = new PersistenceTracer(),
    private connected = false,
  ) {}

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async ping(): Promise<boolean> {
    return this.connected;
  }

  async transaction<T>(fn: (tx: TransactionHandle) => Promise<T>): Promise<T> {
    const snapshot = this.tables.snapshot();
    const tx: TransactionHandle = {
      id: `tx-${Date.now()}`,
      query: (command) => this.query(command),
      command: (command) => this.command(command),
      commit: async () => undefined,
      rollback: async () => {
        this.tables.restore(snapshot);
      },
    };
    try {
      return await this.tracer.measureAsync("transaction", undefined, () => fn(tx));
    } catch (error) {
      this.tables.restore(snapshot);
      throw error;
    }
  }

  async query(command: PersistenceQuery): Promise<QueryResult> {
    return this.tracer.measureAsync("query", command.table, async () => {
      const started = Date.now();
      const rows = this.tables.list(asTable(command.table), this.scope, {
        ...command.options,
        filter: { ...command.filters, ...command.options?.filter },
      });
      return { rows, rowCount: rows.length, durationMs: Date.now() - started };
    });
  }

  async command(command: PersistenceCommand): Promise<QueryResult> {
    return this.tracer.measureAsync("command", command.table, async () => {
      const started = Date.now();
      const table = asTable(command.table);
      if (command.op === "insert" && command.row) {
        const row = this.tables.insert(table, command.row, this.scope);
        return { rows: [row], rowCount: 1, durationMs: Date.now() - started };
      }
      if (command.op === "update" && command.id) {
        const row = this.tables.update(table, command.id, command.patch ?? {}, this.scope, command.expectedVersion);
        return { rows: [row], rowCount: 1, durationMs: Date.now() - started };
      }
      if ((command.op === "delete" || command.op === "archive") && command.id) {
        const row = this.tables.archive(table, command.id, this.scope);
        return { rows: [row], rowCount: 1, durationMs: Date.now() - started };
      }
      throw new QueryError("Neveljaven persistence ukaz.");
    });
  }
}

function asTable(table: string): PersistenceTable {
  return table as PersistenceTable;
}

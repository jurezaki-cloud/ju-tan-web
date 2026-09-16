import type {
  PostgresDriver,
  PostgresQueryResult,
  PostgresTransaction,
  SqlParam,
  SqlStatement,
} from "@/src/types/postgres";
import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceTracer } from "../observability";
import { PersistencePolicy } from "../security";
import { PostgresRowMapper } from "./mapper";
import { PostgresTx } from "./transaction";
import { PostgresClient } from "./client";
import { classifyDbError } from "./errors";
import { QueryError } from "../errors";
import type { PersistenceTable } from "../entities";
import { ConcurrencyError } from "../errors";

export class CompatiblePostgresDriver implements PostgresDriver {
  private connected = false;
  private readonly mapper = new PostgresRowMapper();
  private readonly policy = new PersistencePolicy();

  constructor(
    private readonly tables: InMemoryTables,
    private readonly scope: TenantScope,
    private readonly tracer = new PersistenceTracer(),
    private readonly client?: PostgresClient,
  ) {}

  async connect(): Promise<void> {
    await this.client?.connect();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    await this.client?.disconnect();
    this.connected = false;
  }

  async ping(): Promise<boolean> {
    if (this.client?.live) return this.client.ping();
    return this.connected || true;
  }

  async query(statement: SqlStatement): Promise<PostgresQueryResult> {
    return this.tracer.measureAsync("query", statement.spec.table, async () => this.run(statement));
  }

  async command(statement: SqlStatement): Promise<PostgresQueryResult> {
    return this.tracer.measureAsync("command", statement.spec.table, async () => this.run(statement));
  }

  querySync(statement: SqlStatement): PostgresQueryResult {
    return this.tracer.measure("query", statement.spec.table, () => this.runSync(statement));
  }

  async transaction<T>(fn: (tx: PostgresTransaction) => Promise<T>): Promise<T> {
    return this.tracer.measureAsync("transaction", undefined, async () => {
      const tx = new PostgresTx(`pg-tx-${Date.now()}`, this, this.tables);
      try {
        const result = await fn(tx);
        await tx.commit();
        return result;
      } catch (error) {
        await tx.rollback();
        throw error;
      }
    });
  }

  async execute(sql: string, params: SqlParam[] = []): Promise<PostgresQueryResult> {
    if (this.client?.live) return this.client.execute(sql, params);
    return { rows: [], rowCount: 0, durationMs: 0 };
  }

  get traces() {
    return this.tracer;
  }

  get physical(): boolean {
    return Boolean(this.client?.live);
  }

  private run(statement: SqlStatement): PostgresQueryResult {
    try {
      return this.runSync(statement);
    } catch (error) {
      const classified = classifyDbError(error);
      throw new QueryError(classified.message);
    }
  }

  private runSync(statement: SqlStatement): PostgresQueryResult {
    this.policy.assertScope(this.scope);
    const started = Date.now();
    const spec = statement.spec;
    const table = spec.table as PersistenceTable;
    const tenantFilters = {
      tenantId: this.scope.tenantId,
      organizationId: this.scope.organizationId,
      workspaceId: this.scope.workspaceId,
      ...spec.filters,
    };

    if (spec.op === "select" || spec.op === "count" || spec.op === "exists") {
      const rows = this.tables.list(table, this.scope, {
        filter: tenantFilters,
        includeDeleted: spec.includeDeleted,
        sort: spec.orderBy ? { field: spec.orderBy.column, direction: spec.orderBy.direction } : undefined,
        page: spec.limit && spec.offset !== undefined ? Math.floor(spec.offset / spec.limit) + 1 : undefined,
        pageSize: spec.limit,
      });
      if (spec.op === "count") {
        return { rows: [{ count: rows.length }], rowCount: 1, durationMs: Date.now() - started };
      }
      if (spec.op === "exists") {
        return { rows: rows.length ? [{ exists: true }] : [], rowCount: rows.length ? 1 : 0, durationMs: Date.now() - started };
      }
      return { rows: rows.map((row) => this.mapper.fromRecord(row)), rowCount: rows.length, durationMs: Date.now() - started };
    }

    if (spec.op === "insert") {
      const record = this.recordFromData(spec.data ?? {});
      const saved = this.tables.insert(table, record, this.scope);
      return { rows: [this.mapper.fromRecord(saved)], rowCount: 1, durationMs: Date.now() - started };
    }

    const id = String(spec.filters?.id ?? "");
    this.policy.assertId(id);
    if (spec.op === "update") {
      const current = this.tables.get(table, id, this.scope);
      if (!current) throw new ConcurrencyError("Zapis ne obstaja.");
      const patch = this.recordFromData({ ...current.data, ...(spec.data ?? {}) }, current);
      const saved = this.tables.update(table, id, patch, this.scope, spec.expectedVersion);
      return { rows: [this.mapper.fromRecord(saved)], rowCount: 1, durationMs: Date.now() - started };
    }
    if (spec.op === "soft-delete") {
      const saved = this.tables.archive(table, id, this.scope);
      return { rows: [this.mapper.fromRecord(saved)], rowCount: 1, durationMs: Date.now() - started };
    }
    throw new QueryError("Nepodprt SQL ukaz.");
  }

  private recordFromData(data: Record<string, unknown>, current?: PersistenceRecord): PersistenceRecord {
    const now = new Date().toISOString();
    return {
      id: String(data.id ?? current?.id),
      createdAt: current?.createdAt ?? String(data.createdAt ?? now),
      updatedAt: now,
      status: String(data.status ?? current?.status ?? "active"),
      metadata: (data.metadata as Record<string, unknown>) ?? current?.metadata ?? {},
      tenantId: this.scope.tenantId,
      workspaceId: this.scope.workspaceId ?? "ws-demo",
      ownerId: data.ownerId ? String(data.ownerId) : current?.ownerId,
      organizationId: this.scope.organizationId,
      deletedAt: (data.deletedAt as string | null | undefined) ?? current?.deletedAt ?? null,
      version: current?.version ?? 1,
      data: { ...(current?.data ?? {}), ...data },
    };
  }
}

import type { PersistenceRecord, QueryOptions, RepositoryAdapter, TenantScope } from "@/src/types/persistence";
import type { DbRow, SqlParam } from "@/src/types/postgres";
import type { PersistenceTable } from "../entities";
import { CompatiblePostgresDriver } from "./driver";
import { SqlQueryBuilder } from "./query-builder";
import { PostgresRowMapper } from "./mapper";
import { PersistencePolicy } from "../security";
import { PersistenceTracer } from "../observability";

export type PostgresEntityMapper<T> = {
  toDomain(record: PersistenceRecord): T;
  toRecord(item: T, scope?: TenantScope): PersistenceRecord;
  fromRow(row: DbRow, scope?: TenantScope): T;
};

export class PostgresRepository<T extends { id: string }> implements RepositoryAdapter<T> {
  constructor(
    private readonly table: PersistenceTable,
    private readonly driver: CompatiblePostgresDriver,
    private readonly mapper: PostgresEntityMapper<T>,
    private readonly scope: TenantScope,
    private readonly builder = new SqlQueryBuilder(),
    private readonly rows = new PostgresRowMapper(),
    private readonly policy = new PersistencePolicy(),
    private readonly tracer = new PersistenceTracer(),
    private readonly onChange?: () => void,
  ) {}

  list(options?: QueryOptions): T[] {
    return this.tracer.measure("repository", this.table, () => {
      this.policy.assertScope(this.scope);
      const stmt = this.builder.select(
        this.table,
        toSqlFilters({ ...this.policy.scoped(this.scope), ...(options?.filter ?? {}) }),
        {
          includeDeleted: options?.includeDeleted,
          orderBy: options?.sort ? { column: options.sort.field, direction: options.sort.direction } : undefined,
          limit: options?.pageSize,
          offset: options?.page && options.pageSize ? (options.page - 1) * options.pageSize : undefined,
        },
      );
      return this.driver.querySync(stmt).rows.map((row) => this.mapper.fromRow(row, this.scope));
    });
  }

  getById(id: string): T | undefined {
    this.policy.assertScope(this.scope);
    this.policy.assertId(id);
    const stmt = this.builder.select(this.table, toSqlFilters({ ...this.policy.scoped(this.scope), id }));
    const row = this.driver.querySync(stmt).rows[0];
    return row ? this.mapper.fromRow(row, this.scope) : undefined;
  }

  getByIds(ids: string[]): T[] {
    return ids.map((id) => this.getById(id)).filter((item): item is T => Boolean(item));
  }

  save(entity: T): T {
    this.policy.assertScope(this.scope);
    this.policy.assertId(entity.id);
    const record = this.mapper.toRecord(entity, this.scope);
    const payload = this.rows.fromRecord(record);
    const found = this.driver.querySync(this.builder.select(this.table, toSqlFilters({ ...this.policy.scoped(this.scope), id: entity.id })));
    const stmt = found.rows[0]
      ? this.builder.update(
          this.table,
          toSqlFilters({ ...this.policy.scoped(this.scope), id: entity.id }),
          payload,
          Number(found.rows[0].version ?? 1),
        )
      : this.builder.insert(this.table, payload);
    this.driver.querySync(stmt);
    this.onChange?.();
    return entity;
  }

  archive(id: string): boolean {
    this.policy.assertScope(this.scope);
    this.policy.assertId(id);
    const stmt = this.builder.softDelete(this.table, toSqlFilters({ ...this.policy.scoped(this.scope), id }));
    this.driver.querySync(stmt);
    this.onChange?.();
    return true;
  }

  delete(id: string): boolean {
    return this.archive(id);
  }
}

function toSqlFilters(input: Record<string, unknown>): Record<string, SqlParam | undefined> {
  const next: Record<string, SqlParam | undefined> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) next[key] = undefined;
    else if (value === null) next[key] = null;
    else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") next[key] = value;
    else if (value instanceof Date) next[key] = value;
  }
  return next;
}

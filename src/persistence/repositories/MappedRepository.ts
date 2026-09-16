import type { QueryOptions, RepositoryAdapter, TenantScope } from "@/src/types/persistence";
import type { PersistenceTable } from "../entities";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceTracer } from "../observability";
import { PersistencePolicy } from "../security";
import { InMemoryRepositoryCache } from "../security";
import type { RecordMapper } from "./types";

export class MappedRepository<T extends { id: string }> implements RepositoryAdapter<T> {
  constructor(
    private readonly table: PersistenceTable,
    private readonly tables: InMemoryTables,
    private readonly mapper: RecordMapper<T>,
    private readonly scope: TenantScope,
    private readonly tracer = new PersistenceTracer(),
    private readonly policy = new PersistencePolicy(),
    private readonly cache = new InMemoryRepositoryCache(),
    private readonly onChange?: () => void,
  ) {}

  list(options?: QueryOptions): T[] {
    return this.tracer.measure("repository", this.table, () => {
      const key = `${this.table}:${JSON.stringify(options ?? {})}`;
      const cached = this.cache.get<T[]>(key);
      if (cached) return cached;
      const items = this.tables.list(this.table, this.scope, options).map((row) => this.mapper.toDomain(row));
      this.cache.set(key, items);
      return items;
    });
  }

  getById(id: string): T | undefined {
    this.policy.assertId(id);
    const row = this.tables.get(this.table, id, this.scope);
    return row ? this.mapper.toDomain(row) : undefined;
  }

  getByIds(ids: string[]): T[] {
    return ids.map((id) => this.getById(id)).filter((item): item is T => Boolean(item));
  }

  save(entity: T): T {
    this.policy.assertId(entity.id);
    const record = this.mapper.toRecord(entity, this.scope);
    const existing = this.tables.get(this.table, entity.id, this.scope);
    if (existing) this.tables.update(this.table, entity.id, record, this.scope, existing.version);
    else this.tables.insert(this.table, record, this.scope);
    this.cache.invalidate(this.table);
    this.onChange?.();
    return entity;
  }

  archive(id: string): boolean {
    this.policy.assertId(id);
    this.tables.archive(this.table, id, this.scope);
    this.cache.invalidate(this.table);
    this.onChange?.();
    return true;
  }

  delete(id: string): boolean {
    return this.archive(id);
  }
}

import type { PersistenceRecord, QueryOptions, TenantScope } from "@/src/types/persistence";
import { PERSISTENCE_TABLES, type PersistenceTable } from "../entities";
import { ConcurrencyError } from "../errors";
import { PersistencePolicy } from "../security";

export class InMemoryTables {
  constructor(
    private readonly tables = new Map<string, PersistenceRecord[]>(),
    private readonly policy = new PersistencePolicy(),
  ) {
    for (const table of PERSISTENCE_TABLES) {
      if (!this.tables.has(table)) this.tables.set(table, []);
    }
  }

  snapshot(): Map<string, PersistenceRecord[]> {
    return new Map([...this.tables.entries()].map(([key, rows]) => [key, rows.map((row) => ({ ...row, data: { ...row.data }, metadata: { ...row.metadata } }))]));
  }

  restore(snapshot: Map<string, PersistenceRecord[]>): void {
    this.tables.clear();
    for (const [key, rows] of snapshot.entries()) {
      this.tables.set(key, rows.map((row) => ({ ...row, data: { ...row.data }, metadata: { ...row.metadata } })));
    }
  }

  list(table: PersistenceTable, scope: TenantScope, options: QueryOptions = {}): PersistenceRecord[] {
    const rows = (this.tables.get(table) ?? []).filter((row) => {
      if (row.tenantId !== scope.tenantId || row.organizationId !== scope.organizationId) return false;
      if (scope.workspaceId && row.workspaceId !== scope.workspaceId) return false;
      if (!options.includeDeleted && row.deletedAt) return false;
      return matchesFilter(row, options.filter);
    });
    const searched = options.search
      ? rows.filter((row) => matchesSearch(row, options.search ?? "", options.searchFields))
      : rows;
    const sorted = sortRows(searched, options.sort);
    void options.relations;
    void options.indexHint;
    return paginate(sorted, options).map(cloneRecord);
  }

  get(table: PersistenceTable, id: string, scope: TenantScope): PersistenceRecord | undefined {
    this.policy.assertId(id);
    const row = (this.tables.get(table) ?? []).find((item) => item.id === id && !item.deletedAt);
    if (!row) return undefined;
    this.policy.assertTenant(row, scope);
    return cloneRecord(row);
  }

  insert(table: PersistenceTable, row: PersistenceRecord, scope: TenantScope): PersistenceRecord {
    this.policy.assertTenant(row, scope);
    const next = { ...cloneRecord(row), version: row.version || 1 };
    const rows = this.tables.get(table) ?? [];
    rows.push(next);
    this.tables.set(table, rows);
    return cloneRecord(next);
  }

  update(table: PersistenceTable, id: string, patch: Partial<PersistenceRecord>, scope: TenantScope, expectedVersion?: number): PersistenceRecord {
    this.policy.assertId(id);
    const rows = this.tables.get(table) ?? [];
    const index = rows.findIndex((item) => item.id === id);
    if (index < 0) throw new ConcurrencyError("Zapis ne obstaja.");
    const current = rows[index];
    this.policy.assertTenant(current, scope);
    if (expectedVersion !== undefined && current.version !== expectedVersion) throw new ConcurrencyError();
    const next: PersistenceRecord = {
      ...current,
      ...patch,
      id: current.id,
      data: { ...current.data, ...(patch.data ?? {}) },
      metadata: { ...current.metadata, ...(patch.metadata ?? {}) },
      updatedAt: new Date().toISOString(),
      version: current.version + 1,
    };
    rows[index] = next;
    return cloneRecord(next);
  }

  archive(table: PersistenceTable, id: string, scope: TenantScope): PersistenceRecord {
    return this.update(table, id, { deletedAt: new Date().toISOString(), status: "archived" }, scope);
  }

  restoreRecord(table: PersistenceTable, id: string, scope: TenantScope): PersistenceRecord {
    this.policy.assertId(id);
    const rows = this.tables.get(table) ?? [];
    const index = rows.findIndex((item) => item.id === id);
    if (index < 0) throw new ConcurrencyError("Zapis ne obstaja.");
    const current = rows[index];
    this.policy.assertTenant(current, scope);
    const next: PersistenceRecord = {
      ...current,
      deletedAt: null,
      status: current.status === "archived" ? "active" : current.status,
      updatedAt: new Date().toISOString(),
      version: current.version + 1,
    };
    rows[index] = next;
    return cloneRecord(next);
  }

  count(table: PersistenceTable, scope: TenantScope): number {
    return this.list(table, scope).length;
  }
}

function cloneRecord(row: PersistenceRecord): PersistenceRecord {
  return { ...row, data: { ...row.data }, metadata: { ...row.metadata } };
}

function matchesFilter(row: PersistenceRecord, filter?: Record<string, unknown>): boolean {
  if (!filter) return true;
  return Object.entries(filter).every(([key, value]) => {
    if (value === undefined) return true;
    if (key in row) return (row as unknown as Record<string, unknown>)[key] === value;
    return row.data[key] === value;
  });
}

function matchesSearch(row: PersistenceRecord, query: string, fields?: string[]): boolean {
  const q = query.toLowerCase();
  const haystack = [row.id, row.status, JSON.stringify(row.data), ...(fields ?? []).map((field) => String(row.data[field] ?? ""))];
  return haystack.some((item) => item.toLowerCase().includes(q));
}

function sortRows(rows: PersistenceRecord[], sort?: QueryOptions["sort"]): PersistenceRecord[] {
  if (!sort) return rows;
  return [...rows].sort((a, b) => {
    const left = String((a as unknown as Record<string, unknown>)[sort.field] ?? a.data[sort.field] ?? "");
    const right = String((b as unknown as Record<string, unknown>)[sort.field] ?? b.data[sort.field] ?? "");
    const cmp = left.localeCompare(right);
    return sort.direction === "desc" ? -cmp : cmp;
  });
}

function paginate(rows: PersistenceRecord[], options: QueryOptions): PersistenceRecord[] {
  if (!options.page || !options.pageSize) return rows;
  const start = Math.max(0, (options.page - 1) * options.pageSize);
  return rows.slice(start, start + options.pageSize);
}

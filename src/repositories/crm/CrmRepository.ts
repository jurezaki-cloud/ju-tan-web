import type { QueryOptions, RepositoryAdapter, TenantScope } from "@/src/types/persistence";
import type { CrmEntity } from "@/src/domain/crm";
import type { CrmListResult, CrmQueryParams } from "@/src/types/crm";
import { InMemoryTables } from "@/src/persistence/db/InMemoryTables";
import type { PersistenceTable } from "@/src/persistence/entities";
import { appPersistence } from "@/src/persistence/app";
import { defaultTenant } from "@/src/persistence/entities";

export class CrmRepository<T extends CrmEntity> {
  constructor(
    private readonly table: PersistenceTable,
    private readonly records: RepositoryAdapter<T>,
    private readonly tables: InMemoryTables = appPersistence.tables,
    private readonly scope: TenantScope = appPersistence.tenant ?? defaultTenant,
  ) {}

  create(entity: T): T {
    return this.records.save(entity);
  }

  getById(id: string, includeDeleted = false): T | undefined {
    if (!includeDeleted) return this.records.getById(id);
    return this.records.list({ includeDeleted: true, filter: { id } })[0];
  }

  list(params: CrmQueryParams = {}): CrmListResult<T> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 50;
    const items = this.records.list({
      search: params.search,
      filter: {
        ...(params.status ? { status: params.status } : {}),
        ...(params.clientId ? { clientId: params.clientId } : {}),
        ...(params.leadId ? { leadId: params.leadId } : {}),
        ...(params.opportunityId ? { opportunityId: params.opportunityId } : {}),
        ...((params as { projectId?: string }).projectId ? { projectId: (params as { projectId?: string }).projectId } : {}),
      },
      sort: params.sort ? { field: params.sort, direction: params.direction ?? "asc" } : { field: "updatedAt", direction: "desc" },
      includeDeleted: params.includeDeleted,
      page,
      pageSize,
    } satisfies QueryOptions);
    const total = this.records.list({
      search: params.search,
      filter: {
        ...(params.status ? { status: params.status } : {}),
        ...(params.clientId ? { clientId: params.clientId } : {}),
      },
      includeDeleted: params.includeDeleted,
    }).length;
    return { items, total, page, pageSize };
  }

  update(entity: T): T {
    return this.records.save(entity);
  }

  archive(id: string): boolean {
    return this.records.archive(id);
  }

  restore(id: string): T | undefined {
    this.tables.restoreRecord(this.table, id, this.scope);
    return this.getById(id);
  }

  search(query: string): T[] {
    return this.records.list({ search: query });
  }

  count(params: CrmQueryParams = {}): number {
    return this.list({ ...params, page: 1, pageSize: 10000 }).total;
  }

  getByClientId(clientId: string): T[] {
    return this.records.list({ filter: { clientId } });
  }

  getByLeadId(leadId: string): T[] {
    return this.records.list({ filter: { leadId } });
  }

  getByProjectId(projectId: string): T[] {
    return this.records.list({ filter: { projectId } });
  }

  getByOfferId(offerId: string): T[] {
    return this.records.list().filter((item) => (item as { offerId?: string }).offerId === offerId);
  }
}

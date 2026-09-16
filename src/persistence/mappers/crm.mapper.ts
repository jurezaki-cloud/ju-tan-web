import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import type { CrmEntity } from "@/src/domain/crm";
import { baseRecord } from "../mapping";
import { defaultTenant } from "../entities";

export class CrmEntityMapper<T extends CrmEntity> {
  toDomain(row: PersistenceRecord): T {
    const data = row.data;
    return {
      ...data,
      id: row.id,
      createdAt: String(data.createdAt ?? row.createdAt),
      updatedAt: String(data.updatedAt ?? row.updatedAt),
      status: String(data.status ?? row.status),
      metadata: (data.metadata as Record<string, unknown>) ?? row.metadata ?? {},
      tenantId: row.tenantId,
      organizationId: row.organizationId,
      workspaceId: row.workspaceId,
      ownerId: row.ownerId ?? (data.ownerId ? String(data.ownerId) : undefined),
      deletedAt: row.deletedAt ?? null,
      version: row.version,
    } as T;
  }

  toRecord(item: T, scope: TenantScope = defaultTenant): PersistenceRecord {
    return baseRecord(item.id, item.status, { ...(item as unknown as Record<string, unknown>) }, scope, {
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      metadata: item.metadata,
      ownerId: item.ownerId,
      deletedAt: item.deletedAt ?? null,
      version: item.version,
      tenantId: item.tenantId,
      organizationId: item.organizationId,
      workspaceId: item.workspaceId,
    });
  }
}

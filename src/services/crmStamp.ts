import type { CrmEntity } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import { defaultTenant } from "@/src/persistence/entities";

export function nextCrmId(prefix: string, count: number): string {
  return `${prefix}-${String(count + 1).padStart(2, "0")}`;
}

export function stampCrm<T extends CrmEntity>(
  id: string,
  status: string,
  fields: Omit<T, keyof CrmEntity> & Partial<CrmEntity>,
): T {
  const now = new Date().toISOString();
  const tenant = appPersistence.tenant;
  return {
    id,
    createdAt: fields.createdAt ?? now,
    updatedAt: now,
    status,
    metadata: fields.metadata ?? {},
    tenantId: tenant.tenantId,
    organizationId: tenant.organizationId,
    workspaceId: tenant.workspaceId ?? defaultTenant.workspaceId,
    ownerId: fields.ownerId,
    deletedAt: fields.deletedAt ?? null,
    version: fields.version ?? 1,
    ...fields,
  } as T;
}

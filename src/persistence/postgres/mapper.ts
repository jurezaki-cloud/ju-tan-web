import type { DbRow } from "@/src/types/postgres";
import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import { defaultTenant } from "../entities";

export class PostgresRowMapper {
  toColumns(row: Record<string, unknown>): Record<string, unknown> {
    const columns: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      columns[toColumn(key)] = value === undefined ? null : value;
    }
    return columns;
  }

  fromRow(row: DbRow): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      result[toCamel(key)] = value;
    }
    return result;
  }

  toRecord(row: DbRow, scope: TenantScope = defaultTenant): PersistenceRecord {
    const data = asObject(row.data);
    return {
      id: String(row.id),
      createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
      updatedAt: String(row.updated_at ?? row.updatedAt ?? new Date().toISOString()),
      status: String(row.status ?? "active"),
      metadata: asObject(row.metadata),
      tenantId: String(row.tenant_id ?? row.tenantId ?? scope.tenantId),
      workspaceId: String(row.workspace_id ?? row.workspaceId ?? scope.workspaceId ?? defaultTenant.workspaceId),
      ownerId: row.owner_id ? String(row.owner_id) : undefined,
      organizationId: String(row.organization_id ?? row.organizationId ?? scope.organizationId),
      deletedAt: row.deleted_at ? String(row.deleted_at) : null,
      version: Number(row.version ?? 1),
      data,
    };
  }

  fromRecord(record: PersistenceRecord): DbRow {
    return {
      id: record.id,
      created_at: record.createdAt,
      updated_at: record.updatedAt,
      status: record.status,
      metadata: record.metadata,
      tenant_id: record.tenantId,
      workspace_id: record.workspaceId,
      organization_id: record.organizationId,
      owner_id: record.ownerId ?? null,
      deleted_at: record.deletedAt ?? null,
      version: record.version,
      data: record.data,
      name: record.data.name ?? null,
      email: record.data.email ?? null,
      client_id: record.data.clientId ?? record.data.client_id ?? null,
      project_id: record.data.projectId ?? record.data.project_id ?? null,
      external_id: record.data.externalId ?? record.data.external_id ?? null,
    };
  }
}

function toColumn(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function asObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

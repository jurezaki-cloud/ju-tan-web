import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import type { Client } from "@/src/domain/client";
import type { Lead } from "@/src/domain/lead";
import type { Project } from "@/src/domain/project";
import type { Ticket } from "@/src/domain/ticket";
import type { User } from "@/src/domain/user";
import type { Document } from "@/src/domain/document";
import { defaultTenant } from "../entities";

export function baseRecord(
  id: string,
  status: string,
  data: Record<string, unknown>,
  scope: TenantScope = defaultTenant,
  extra: Partial<PersistenceRecord> = {},
): PersistenceRecord {
  const now = extra.updatedAt ?? extra.createdAt ?? new Date().toISOString();
  return {
    id,
    createdAt: extra.createdAt ?? now,
    updatedAt: extra.updatedAt ?? now,
    status,
    metadata: extra.metadata ?? {},
    tenantId: extra.tenantId ?? scope.tenantId,
    workspaceId: extra.workspaceId ?? scope.workspaceId ?? defaultTenant.workspaceId,
    ownerId: extra.ownerId,
    organizationId: extra.organizationId ?? scope.organizationId,
    deletedAt: extra.deletedAt ?? null,
    version: extra.version ?? 1,
    data,
  };
}

export class ClientMapper {
  toDomain(row: PersistenceRecord): Client {
    return row.data as unknown as Client;
  }
  toRecord(item: Client, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, item.status, { ...item }, scope);
  }
}

export class LeadMapper {
  toDomain(row: PersistenceRecord): Lead {
    return row.data as unknown as Lead;
  }
  toRecord(item: Lead, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, item.status, { ...item }, scope);
  }
}

export class DocumentMapper {
  toDomain(row: PersistenceRecord): Document {
    return row.data as unknown as Document;
  }
  toRecord(item: Document, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, item.kind, { ...item }, scope);
  }
}

export class ArtifactMapper {
  toDomain(row: PersistenceRecord): { id: string } {
    return { id: row.id, ...row.data };
  }
  toRecord(item: { id: string }, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, "active", { ...item }, scope);
  }
}

export class SessionMapper {
  toDomain(row: PersistenceRecord): { id: string } {
    return { id: row.id, ...row.data };
  }
  toRecord(item: { id: string }, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, "active", { ...item }, scope);
  }
}

export class AuditMapper {
  toDomain(row: PersistenceRecord): { id: string } {
    return { id: row.id, ...row.data };
  }
  toRecord(item: { id: string }, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, "event", { ...item }, scope);
  }
}

export class ProjectMapper {
  toDomain(row: PersistenceRecord): Project {
    return row.data as unknown as Project;
  }
  toRecord(item: Project, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, item.status, { ...item }, scope);
  }
}

export class TicketMapper {
  toDomain(row: PersistenceRecord): Ticket {
    return row.data as unknown as Ticket;
  }
  toRecord(item: Ticket, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, item.status, { ...item }, scope);
  }
}

export class UserMapper {
  toDomain(row: PersistenceRecord): User {
    return row.data as unknown as User;
  }
  toRecord(item: User, scope?: TenantScope): PersistenceRecord {
    return baseRecord(item.id, "Active", { ...item }, scope);
  }
}

export class JsonEntityMapper<T extends { id: string; status: string }> {
  toDomain(row: PersistenceRecord): T {
    return row.data as unknown as T;
  }

  toRecord(item: T, scope?: TenantScope): PersistenceRecord {
    const record = item as T & {
      tenantId?: string;
      organizationId?: string;
      workspaceId?: string;
      ownerId?: string;
      deletedAt?: string | null;
      version?: number;
      metadata?: Record<string, unknown>;
      createdAt?: string;
      updatedAt?: string;
    };
    return baseRecord(item.id, item.status, { ...item } as unknown as Record<string, unknown>, scope, {
      tenantId: record.tenantId,
      organizationId: record.organizationId,
      workspaceId: record.workspaceId,
      ownerId: record.ownerId,
      deletedAt: record.deletedAt,
      version: record.version,
      metadata: record.metadata,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

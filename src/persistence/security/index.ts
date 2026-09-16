import type { PersistenceRecord, RepositoryCache, TenantScope } from "@/src/types/persistence";
import { TenantIsolationError, ValidationError } from "../errors";

const ID = /^[a-zA-Z0-9._:-]{1,80}$/;

export class PersistencePolicy {
  assertId(id: string): void {
    if (!ID.test(id)) throw new ValidationError("Neveljaven identifikator.");
  }

  assertScope(scope?: TenantScope): TenantScope {
    if (!scope?.tenantId || !scope.organizationId || !scope.workspaceId) {
      throw new TenantIsolationError("Tenant scope manjka.");
    }
    return scope;
  }

  assertTenant(row: PersistenceRecord, scope: TenantScope): void {
    if (row.tenantId !== scope.tenantId || row.organizationId !== scope.organizationId) {
      throw new TenantIsolationError();
    }
  }

  scoped(scope: TenantScope): Record<string, unknown> {
    return {
      tenantId: scope.tenantId,
      organizationId: scope.organizationId,
      ...(scope.workspaceId ? { workspaceId: scope.workspaceId } : {}),
    };
  }

  canWrite(): boolean {
    return true;
  }

  canRead(): boolean {
    return true;
  }

  softDelete(): boolean {
    return true;
  }
}

export class InMemoryRepositoryCache implements RepositoryCache {
  constructor(private readonly values = new Map<string, unknown>()) {}

  get<T>(key: string): T | undefined {
    return this.values.get(key) as T | undefined;
  }

  set<T>(key: string, value: T): void {
    this.values.set(key, value);
  }

  invalidate(prefix: string): void {
    for (const key of this.values.keys()) {
      if (key.startsWith(prefix)) this.values.delete(key);
    }
  }
}

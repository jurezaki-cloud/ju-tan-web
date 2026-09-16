import type { QueryOptions, RepositoryAdapter } from "@/src/types/persistence";
import { appPersistence } from "@/src/persistence/app";
import type {
  InviteAbuseFlag,
  InviteAttemptRecord,
  InviteSecurityState,
  ProxyAnomalyRecord,
  RateLimitBucket,
  RateLimitCleanupRecord,
  RateLimitStoreHealth,
} from "@/src/types/security";
import { scope } from "@/src/services/identity/shared";

class TypedStore<T extends { id: string; status: string }> {
  constructor(private readonly records: RepositoryAdapter<{ id: string; status: string }>) {}

  list(options?: QueryOptions): T[] {
    return this.records.list({ ...options, includeDeleted: options?.includeDeleted }) as T[];
  }

  search(query: string): T[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.list();
    return this.list({ includeDeleted: true }).filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }

  getById(id: string, includeDeleted = false): T | undefined {
    if (!includeDeleted) return this.records.getById(id) as T | undefined;
    return this.list({ includeDeleted: true }).find((item) => item.id === id);
  }

  save(entity: T): T {
    this.records.save(entity);
    return entity;
  }

  update(entity: T): T {
    return this.save(entity);
  }

  archive(id: string): boolean {
    return this.records.archive(id);
  }

  restore(id: string): T | undefined {
    const item = this.getById(id, true);
    if (!item) return undefined;
    const next = { ...item, deletedAt: null } as T;
    this.records.save(next);
    return next;
  }
}

export class RateLimitRepository extends TypedStore<RateLimitBucket> {
  constructor() {
    super(appPersistence.repositories.rateLimitBuckets);
  }

  getByKey(key: string): RateLimitBucket | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.key === key);
  }

  increment(bucket: RateLimitBucket): RateLimitBucket {
    return this.save({
      ...bucket,
      count: bucket.count + 1,
      lastSeenAt: new Date().toISOString(),
      expiresAt: bucket.expiresAt || bucket.windowEnd,
      updatedAt: new Date().toISOString(),
      version: bucket.version + 1,
    });
  }

  sweep(ids: string[]): number {
    return ids.filter((id) => this.archive(id)).length;
  }

  forTenant() {
    const tenantId = scope().tenantId;
    return this.list({ includeDeleted: true }).filter((item) => item.tenantId === tenantId);
  }
}

export class InviteAttemptRepository extends TypedStore<InviteAttemptRecord> {
  constructor() {
    super(appPersistence.repositories.inviteAttempts);
  }

  getBySubject(subject: string, action: InviteAttemptRecord["action"]): InviteAttemptRecord | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.subject === subject && item.action === action);
  }

  increment(record: InviteAttemptRecord): InviteAttemptRecord {
    return this.save({
      ...record,
      count: record.count + 1,
      lastAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: record.version + 1,
    });
  }

  sweep(ids: string[]): number {
    return ids.filter((id) => this.archive(id)).length;
  }
}

export class InviteSecurityRepository extends TypedStore<InviteSecurityState> {
  constructor() {
    super(appPersistence.repositories.inviteSecurity);
  }

  getByTokenHash(tokenHash: string): InviteSecurityState | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.tokenHash === tokenHash);
  }

  getByInvite(inviteId: string): InviteSecurityState | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.inviteId === inviteId);
  }

  sweep(ids: string[]): number {
    return ids.filter((id) => this.archive(id)).length;
  }
}

export class AbuseFlagRepository extends TypedStore<InviteAbuseFlag> {
  constructor() {
    super(appPersistence.repositories.abuseFlags);
  }

  sweep(ids: string[]): number {
    return ids.filter((id) => this.archive(id)).length;
  }
}

export class RateLimitMaintenanceRepository extends TypedStore<RateLimitCleanupRecord> {
  constructor() {
    super(appPersistence.repositories.rateLimitMaintenance);
  }

  latest() {
    return this.list({ includeDeleted: true }).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }
}

export class ProxyAnomalyRepository extends TypedStore<ProxyAnomalyRecord> {
  constructor() {
    super(appPersistence.repositories.proxyAnomalies);
  }

  recentCount(windowMs: number) {
    const from = Date.now() - windowMs;
    return this.list({ includeDeleted: true }).filter((item) => new Date(item.createdAt).getTime() >= from).length;
  }
}

export class RateLimitStoreHealthRepository extends TypedStore<RateLimitStoreHealth> {
  constructor() {
    super(appPersistence.repositories.rateLimitStoreHealth);
  }

  current() {
    return this.list({ includeDeleted: true }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  }
}

export const rateLimitRepository = new RateLimitRepository();
export const inviteAttemptRepository = new InviteAttemptRepository();
export const inviteSecurityRepository = new InviteSecurityRepository();
export const abuseFlagRepository = new AbuseFlagRepository();
export const rateLimitMaintenanceRepository = new RateLimitMaintenanceRepository();
export const proxyAnomalyRepository = new ProxyAnomalyRepository();
export const rateLimitStoreHealthRepository = new RateLimitStoreHealthRepository();

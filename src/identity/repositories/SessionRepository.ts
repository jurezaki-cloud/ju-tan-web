import type { IdentitySession } from "@/src/identity/types";
import type { MockIdentityStore } from "./MockIdentityStore";
import { identityWriteModelService } from "@/src/identity/sync/IdentityWriteModelService";

export class SessionRepository {
  constructor(private readonly store: MockIdentityStore) {}

  save(session: IdentitySession, options?: { rememberMe?: boolean; rotatedFromTokenId?: string; persist?: boolean }): void {
    this.store.sessions.set(session.id, { ...session });
    this.store.refresh.set(session.refreshToken, session.id);
    if (options?.persist === false) return;
    identityWriteModelService.persistSession(session, options);
  }

  get(id: string): IdentitySession | undefined {
    const row = this.store.sessions.get(id);
    return row ? { ...row } : undefined;
  }

  byRefresh(token: string): IdentitySession | undefined {
    const id = this.store.refresh.get(token);
    return id ? this.get(id) : undefined;
  }

  byUser(userId: string): IdentitySession[] {
    return [...this.store.sessions.values()]
      .filter((item) => item.userId === userId)
      .map((item) => ({ ...item }));
  }

  delete(id: string): void {
    const row = this.store.sessions.get(id);
    if (row) this.store.refresh.delete(row.refreshToken);
    this.store.sessions.delete(id);
    identityWriteModelService.revokeSession(id);
  }
}

export class AuditRepository {
  constructor(private readonly store: MockIdentityStore) {}

  record(event: import("@/src/identity/types").IdentityEvent): void {
    this.store.audit.push({ ...event });
  }

  list(): import("@/src/identity/types").IdentityEvent[] {
    return [...this.store.audit];
  }
}

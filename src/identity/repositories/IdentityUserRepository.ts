import type { IdentityUser } from "@/src/identity/types";
import type { MockIdentityStore } from "./MockIdentityStore";
import { identityWriteModelService } from "@/src/identity/sync/IdentityWriteModelService";
import { identityReadModelService } from "@/src/identity/sync/IdentityReadModelService";
import { identityCacheSyncService } from "@/src/identity/sync/IdentityCacheSyncService";

export class IdentityUserRepository {
  constructor(private readonly store: MockIdentityStore) {}

  list(): IdentityUser[] {
    return this.store.users.map((item) => ({ ...item }));
  }

  getById(id: string): IdentityUser | undefined {
    const user = this.store.users.find((item) => item.id === id);
    if (user) return this.hydrate(user);
    const record = identityReadModelService.getUser(id);
    if (!record) return undefined;
    const mapped = identityReadModelService.toKernelUser(record);
    identityCacheSyncService.upsert(this.store, mapped);
    return { ...mapped };
  }

  getByEmail(email: string): IdentityUser | undefined {
    const normalized = email.trim().toLowerCase();
    const user = this.store.users.find((item) => item.email.toLowerCase() === normalized);
    if (user) return this.hydrate(user);
    const record = identityReadModelService.getUserByEmail(email);
    if (!record) return undefined;
    const mapped = identityReadModelService.toKernelUser(record);
    identityCacheSyncService.upsert(this.store, mapped);
    return { ...mapped };
  }

  private hydrate(user: IdentityUser): IdentityUser {
    const cred = identityReadModelService.credential(user.id);
    return cred?.passwordHash ? { ...user, passwordHash: cred.passwordHash } : { ...user };
  }

  save(user: IdentityUser): void {
    const index = this.store.users.findIndex((item) => item.id === user.id);
    if (index >= 0) this.store.users[index] = { ...user };
    else this.store.users.push({ ...user });
    identityWriteModelService.upsertUser(user);
  }
}

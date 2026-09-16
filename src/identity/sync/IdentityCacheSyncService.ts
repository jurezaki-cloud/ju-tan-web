import type { MockIdentityStore } from "@/src/identity/repositories/MockIdentityStore";
import { identityReadModelService } from "./IdentityReadModelService";
import type { IdentityUser } from "@/src/identity/types";

export class IdentityCacheSyncService {
  hydrate(store: MockIdentityStore) {
    const users = identityReadModelService.toKernelUsers();
    store.replaceUsers(users);
  }

  upsert(store: MockIdentityStore, user: IdentityUser) {
    const index = store.users.findIndex((item) => item.id === user.id);
    if (index >= 0) store.users[index] = { ...user };
    else store.users.push({ ...user });
  }

  fromRecord(store: MockIdentityStore, userId: string) {
    const record = identityReadModelService.getUser(userId);
    if (!record) return;
    this.upsert(store, identityReadModelService.toKernelUser(record));
  }
}

export const identityCacheSyncService = new IdentityCacheSyncService();

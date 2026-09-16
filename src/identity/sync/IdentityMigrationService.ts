import type { MockIdentityStore } from "@/src/identity/repositories/MockIdentityStore";
import { mockIdentityUsers } from "@/src/identity/users/mockUsers";
import { identityDemoEnabled } from "@/src/identity/config";
import { identityWriteModelService } from "./IdentityWriteModelService";
import { identityCacheSyncService } from "./IdentityCacheSyncService";
import { userIdentityRepository } from "@/src/repositories/identity/store";
import { hashIdentitySecret } from "./hash";
import { stampEntity } from "./map";
import { sessionIdentityRepository, refreshTokenRepository } from "@/src/repositories/identity/store";
import type { IdentityUser } from "@/src/identity/types";

export class IdentityMigrationService {
  seedIfEmpty(source: IdentityUser[] = mockIdentityUsers) {
    if (!identityDemoEnabled()) return;
    if (userIdentityRepository.list({ includeDeleted: true }).length > 0) return;
    for (const user of source) {
      identityWriteModelService.upsertUser(user);
      identityWriteModelService.setCredential(user.id, user.passwordHash, "demo");
      identityWriteModelService.assignRole(user.id, user.role, "system", "tenant");
      identityWriteModelService.assignWorkspace(user.id, user.workspaceId ?? "ws-demo", ["workspace.access"], "system");
      identityWriteModelService.audit("IdentityUserCreated", "system", user.id, { email: user.email });
      const sid = `ses-demo-${user.id}`;
      const accessHash = hashIdentitySecret(`demo-access-${user.id}`);
      const refreshHash = hashIdentitySecret(`demo-refresh-${user.id}`);
      sessionIdentityRepository.save({
        ...stampEntity(sid, "active", user.id),
        userId: user.id,
        accessTokenHash: accessHash,
        refreshTokenHash: refreshHash,
        expiresAt: new Date(Date.now() + 8 * 60 * 60_000).toISOString(),
        ipAddress: "127.0.0.1",
        userAgent: "seed",
        rememberMe: false,
      });
      refreshTokenRepository.save({
        ...stampEntity(`rft-demo-${user.id}`, "active", user.id),
        userId: user.id,
        sessionId: sid,
        tokenHash: refreshHash,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60_000).toISOString(),
      });
    }
  }

  bootstrap(store: MockIdentityStore) {
    const source = store.users.length ? store.users : identityDemoEnabled() ? mockIdentityUsers : [];
    if (source.length) this.seedIfEmpty(source);
    identityCacheSyncService.hydrate(store);
    identityWriteModelService.cleanupExpired();
  }
}

export const identityMigrationService = new IdentityMigrationService();

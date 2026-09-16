import { AuthService } from "@/src/identity/auth/AuthService";
import { SessionService } from "@/src/identity/session/SessionService";
import { PermissionService } from "@/src/identity/permissions/PermissionService";
import { TokenService } from "@/src/identity/tokens/TokenService";
import { MockIdentityStore } from "@/src/identity/repositories/MockIdentityStore";
import { IdentityUserRepository } from "@/src/identity/repositories/IdentityUserRepository";
import { AuditRepository, SessionRepository } from "@/src/identity/repositories/SessionRepository";
import { IdentityAudit } from "@/src/identity/audit";
import { IdentityController } from "@/src/identity/controller";
import { identityMigrationService } from "@/src/identity/sync/IdentityMigrationService";

type IdentityKernel = {
  store: MockIdentityStore;
  controller: IdentityController;
  auth: AuthService;
  sessions: SessionService;
  permissions: PermissionService;
  tokens: TokenService;
  audit: IdentityAudit;
};

const globalForIdentity = globalThis as { __jtIdentity?: IdentityKernel };

export function createIdentity(store = new MockIdentityStore()): IdentityKernel {
  identityMigrationService.bootstrap(store);
  const tokens = new TokenService();
  const users = new IdentityUserRepository(store);
  const sessionRepo = new SessionRepository(store);
  const auditRepo = new AuditRepository(store);
  const sessions = new SessionService(sessionRepo, tokens, store);
  const permissions = new PermissionService();
  const auth = new AuthService(users, sessions, permissions, auditRepo, tokens);
  const audit = new IdentityAudit(auditRepo);
  const controller = new IdentityController(auth, sessions, permissions, audit);
  return { store, controller, auth, sessions, permissions, tokens, audit };
}

export function getIdentity(): IdentityKernel {
  if (!globalForIdentity.__jtIdentity) {
    globalForIdentity.__jtIdentity = createIdentity();
  }
  return globalForIdentity.__jtIdentity;
}

export { AuthError, IdentityError, PermissionError, SessionError, ValidationError } from "@/src/identity/errors";
export { resolveIdentityHome, safeNextPath } from "@/src/identity/redirects";

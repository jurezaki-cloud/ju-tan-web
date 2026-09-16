import { AuthService } from "@/src/identity/auth/AuthService";
import { SessionService } from "@/src/identity/session/SessionService";
import { PermissionService } from "@/src/identity/permissions/PermissionService";
import { IdentityAudit } from "@/src/identity/audit";
import { AuthError } from "@/src/identity/errors";
import { resolveIdentityHome } from "@/src/identity/redirects";
import type { LoginRequest, LoginResult, PublicIdentityUser } from "@/src/identity/types";
import { Permission } from "@/src/config/permissions";

export class IdentityController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionService,
    private readonly permissions: PermissionService,
    private readonly audit: IdentityAudit,
  ) {}

  async login(request: LoginRequest, meta?: { ipAddress?: string; device?: string }): Promise<LoginResult> {
    return this.auth.login(request, meta);
  }

  logout(token: string): void {
    this.auth.logout(token);
  }

  refresh(refreshToken: string) {
    return this.auth.refresh(refreshToken);
  }

  session(token: string) {
    const { user, session } = this.auth.validate(token);
    return {
      user,
      session,
      permissions: this.permissions.forUser(user),
      home: resolveIdentityHome(user.role),
    };
  }

  deny(user: PublicIdentityUser | undefined, permission: Permission, path: string): boolean {
    if (!user || this.permissions.can(user.role, permission)) return false;
    this.audit.record({
      type: "PermissionDenied",
      at: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      payload: { permission, path },
    });
    return true;
  }

  changePassword(userId: string, current: string, next: string): void {
    this.auth.changePassword(userId, current, next);
  }

  requestPasswordReset(email: string): void {
    this.auth.requestPasswordReset(email);
  }

  resetPassword(email: string, next: string): void {
    this.auth.resetPassword(email, next);
  }

  listSessions(userId: string) {
    return this.sessions.forUser(userId);
  }
}

export { AuthError };

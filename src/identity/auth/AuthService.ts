import { AuthError } from "@/src/identity/errors";
import { identityConfig } from "@/src/identity/config";
import { identityLog } from "@/src/identity/observability";
import type {
  IdentityEvent,
  LoginRequest,
  LoginResult,
  PublicIdentityUser,
} from "@/src/identity/types";
import { toPublicUser } from "@/src/identity/types";
import type { IdentityUserRepository } from "@/src/identity/repositories/IdentityUserRepository";
import type { AuditRepository } from "@/src/identity/repositories/SessionRepository";
import type { SessionService } from "@/src/identity/session/SessionService";
import type { PermissionService } from "@/src/identity/permissions/PermissionService";
import type { TokenService } from "@/src/identity/tokens/TokenService";
import type { RateLimiter, TimingSafeCompare } from "@/src/identity/security";
import { MockTimingSafeCompare, MemoryRateLimiter } from "@/src/identity/security";
import { identitySyncService } from "@/src/identity/sync/IdentitySyncService";

export { AuthError } from "@/src/identity/errors";

export class AuthService {
  constructor(
    private readonly users: IdentityUserRepository,
    private readonly sessions: SessionService,
    private readonly permissions: PermissionService,
    private readonly audit: AuditRepository,
    private readonly tokens: TokenService,
    private readonly compare: TimingSafeCompare = new MockTimingSafeCompare(),
    private readonly limiter: RateLimiter = new MemoryRateLimiter(identityConfig.maxLoginAttempts),
    private readonly now: () => Date = () => new Date(),
  ) {}

  async login(request: LoginRequest, meta?: { ipAddress?: string; device?: string }): Promise<LoginResult> {
    const key = request.email.trim().toLowerCase();
    identityLog("LoginStarted", { email: key });
    const limit = this.limiter.hit(key);
    if (!limit.allowed) {
      this.emit("LoginFailed", { email: request.email, payload: { reason: "rate" } });
      identityLog("LoginFailed", { email: key, reason: "rate" });
      identitySyncService.persistLockout(key);
      throw new AuthError("Preveč poskusov.", "RATE_LIMIT");
    }

    const user = this.users.getByEmail(request.email);
    const expected = user?.passwordHash ?? `${identityConfig.passwordHashPrefix}missing`;
    const presented = `${identityConfig.passwordHashPrefix}${request.password}`;
    const match = this.compare.equal(presented, expected);

    if (!user || !match) {
      this.emit("LoginFailed", { email: request.email });
      identityLog("LoginFailed", { email: key, reason: "credentials" });
      throw new AuthError("Neveljavni podatki.", "INVALID_CREDENTIALS");
    }
    if (user.status !== "Active") {
      this.emit("LoginFailed", { email: request.email, userId: user.id, payload: { reason: "disabled" } });
      identityLog("LoginFailed", { email: key, reason: "disabled" });
      throw new AuthError("Račun ni aktiven.", "DISABLED");
    }

    this.limiter.reset(key);
    user.lastLogin = this.now().toISOString();
    user.updatedAt = user.lastLogin;
    this.users.save(user);

    const session = this.sessions.create({
      userId: user.id,
      role: user.role,
      rememberMe: request.rememberMe,
      ipAddress: meta?.ipAddress,
      device: meta?.device,
      persist: false,
    });
    identitySyncService.persistLogin(user, session, request.rememberMe);
    this.emit("LoginSuccess", { email: user.email, userId: user.id });
    identityLog("LoginSuccess", { email: user.email, userId: user.id, role: user.role });
    return {
      user: toPublicUser(user),
      session,
      permissions: this.permissions.forUser(user),
    };
  }

  logout(token: string): void {
    const session = this.sessions.validate(token);
    if (session) {
      this.sessions.destroy(session.id);
      identitySyncService.persistLogout(session.id, session.userId);
      this.emit("Logout", { userId: session.userId });
    }
  }

  refresh(refreshToken: string): IdentitySessionLike {
    const payload = this.tokens.parse(refreshToken);
    if (!payload || payload.typ !== "refresh") throw new AuthError("Seja ni veljavna.", "INVALID_SESSION");
    if (this.tokens.expired(payload)) {
      this.emit("SessionExpired", { userId: payload.sub });
      throw new AuthError("Seja je potekla.", "EXPIRED");
    }
    const user = this.users.getById(payload.sub);
    if (!user) throw new AuthError("Seja ni veljavna.", "INVALID_SESSION");
    this.sessions.destroy(payload.sid);
    const session = this.sessions.create({
      userId: user.id,
      role: user.role,
      rotatedFromTokenId: payload.sid,
      persist: false,
    });
    identitySyncService.persistRefresh(payload.sid, session, user.id);
    return session;
  }

  validate(token: string): { user: PublicIdentityUser; session: NonNullable<ReturnType<SessionService["validate"]>> } {
    const payload = this.tokens.parse(token);
    if (!payload) throw new AuthError("Seja ni veljavna.", "INVALID_SESSION");
    if (this.tokens.expired(payload)) {
      this.emit("SessionExpired", { userId: payload.sub });
      throw new AuthError("Seja je potekla.", "EXPIRED");
    }
    const session = this.sessions.validate(token);
    if (!session) throw new AuthError("Seja ni veljavna.", "INVALID_SESSION");
    const user = this.users.getById(session.userId);
    if (!user) throw new AuthError("Seja ni veljavna.", "INVALID_SESSION");
    return { user: toPublicUser(user), session };
  }

  changePassword(userId: string, current: string, next: string): void {
    if (!next || next.length < 4) throw new AuthError("Novo geslo ni veljavno.", "VALIDATION");
    const user = this.users.getById(userId);
    if (!user) throw new AuthError("Seja ni veljavna.", "INVALID_SESSION");
    const ok = this.compare.equal(
      `${identityConfig.passwordHashPrefix}${current}`,
      user.passwordHash,
    );
    if (!ok) throw new AuthError("Neveljavni podatki.", "INVALID_CREDENTIALS");
    user.passwordHash = `${identityConfig.passwordHashPrefix}${next}`;
    user.updatedAt = this.now().toISOString();
    this.users.save(user);
    identitySyncService.persistPasswordChange(user);
    this.emit("PasswordChanged", { userId });
  }

  requestPasswordReset(email: string): void {
    const user = this.users.getByEmail(email);
    identitySyncService.persistPasswordResetRequest(email);
    this.emit("PasswordResetRequested", { email, userId: user?.id });
  }

  resetPassword(email: string, next: string): void {
    if (!next || next.length < 4) throw new AuthError("Novo geslo ni veljavno.", "VALIDATION");
    const user = this.users.getByEmail(email);
    if (!user) return;
    user.passwordHash = `${identityConfig.passwordHashPrefix}${next}`;
    user.updatedAt = this.now().toISOString();
    this.users.save(user);
    identitySyncService.persistPasswordResetComplete(user);
    this.emit("PasswordReset", { userId: user.id, email });
  }

  private emit(
    type: IdentityEvent["type"],
    rest: Omit<IdentityEvent, "type" | "at">,
  ): void {
    this.audit.record({ type, at: this.now().toISOString(), ...rest });
  }
}

type IdentitySessionLike = ReturnType<SessionService["create"]>;

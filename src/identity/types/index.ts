import { Role } from "@/src/config/roles";

export type IdentityUserStatus = "Active" | "Invited" | "Disabled";

export type IdentityUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: Role;
  department: string;
  status: IdentityUserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  passwordHash: string;
  tenantId?: string;
  organizationId?: string;
  workspaceId?: string;
};

export type PublicIdentityUser = Omit<IdentityUser, "passwordHash">;

export type PermissionRecord = {
  id: string;
  resource: string;
  action: string;
};

export type IdentitySession = {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  lastActivity: string;
  ipAddress: string;
  device: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResult = {
  user: PublicIdentityUser;
  session: IdentitySession;
  permissions: PermissionRecord[];
};

export type AccessTokenPayload = {
  typ: "access" | "refresh";
  sub: string;
  role: string;
  sid: string;
  exp: number;
  iat: number;
};

export type IdentityEventType =
  | "LoginSuccess"
  | "LoginFailed"
  | "Logout"
  | "PermissionDenied"
  | "SessionExpired"
  | "PasswordChanged"
  | "PasswordResetRequested"
  | "PasswordReset";

export type IdentityEvent = {
  type: IdentityEventType;
  at: string;
  userId?: string;
  email?: string;
  payload?: Record<string, unknown>;
};

export function toPublicUser(user: IdentityUser): PublicIdentityUser {
  const { passwordHash: _passwordHash, ...rest } = user;
  void _passwordHash;
  return rest;
}

export function displayName(user: Pick<PublicIdentityUser, "firstName" | "lastName">): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function initials(user: Pick<PublicIdentityUser, "firstName" | "lastName">): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

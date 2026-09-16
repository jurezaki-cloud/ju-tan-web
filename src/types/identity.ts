import type { Role } from "@/src/config/roles";
import type { PasswordPolicy } from "@/src/domain/identity";
import type { NotificationPayload, NotificationResult } from "@/src/types/notifications";

export type {
  AdminAction,
  IdentityUserRecord,
  Invite,
  InviteAcceptance,
  InviteStatus,
  InviteToken,
  PasswordPolicy,
  PlatformEntity,
  ProvisioningUserStatus,
  User,
  UserAuditEvent,
  UserRoleAssignment,
  UserStatusHistory,
  UserWorkspaceAssignment,
  IdentitySessionEntity,
  IdentityCredential,
  IdentityRefreshToken,
  IdentityPasswordResetToken,
  IdentityAuditEvent,
  IdentityLockout,
  IdentityStatusHistory,
} from "@/src/domain/identity";

export type InviteRequest = {
  email: string;
  role: Role;
  workspaceId?: string;
  department?: string;
  note?: string;
  firstName?: string;
  lastName?: string;
};

export type InviteResult = {
  invite: InviteRecord;
  userId: string;
  notification: NotificationPayload;
  notifications: NotificationPayload[];
  deliveries: NotificationResult[];
};

export type InvitePublic = {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  acceptedAt?: string;
  acceptedBy?: string;
  invitedBy: string;
  note: string;
  userId: string;
  department: string;
  workspaceId: string;
  createdAt: string;
  tokenMasked?: string;
  security?: {
    status: string;
    lockedUntil?: string;
    invalidAttempts: number;
    flagged: boolean;
    storeDegraded?: boolean;
  };
};

export type InviteRecord = InvitePublic & {
  inviteLink?: string;
};

export type InviteAcceptanceRequest = {
  token: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  ipAddress?: string;
  device?: string;
  createSession?: boolean;
};

export type InviteAcceptanceResult = {
  userId: string;
  email: string;
  status: string;
  loginPath: string;
  sessionCreated: boolean;
};

export type UserProvisioningRequest = InviteRequest;

export type UserProvisioningResult = InviteResult;

export type RoleAssignmentRequest = {
  userId: string;
  role: Role;
  scope?: string;
};

export type RoleAssignmentResult = {
  userId: string;
  role: Role;
  scope: string;
};

export type WorkspaceAssignmentRequest = {
  userId: string;
  workspaceId: string;
  permissions?: string[];
};

export type WorkspaceAssignmentResult = {
  userId: string;
  workspaceId: string;
  permissions: string[];
};

export type UserAdminSearchHit = {
  type: "user" | "invite" | "role" | "workspace" | "session" | "audit";
  id: string;
  title: string;
  subtitle: string;
  route: string;
  relevance: number;
  metadata: Record<string, unknown>;
};

export type UserAdminFilters = {
  status?: string;
  role?: string;
  department?: string;
  query?: string;
};

export type UserAdminSort = {
  field: "email" | "createdAt" | "role" | "status";
  direction: "asc" | "desc";
};

export type UserAdminListResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminUserView = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  status: string;
  lastLogin?: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};

export const defaultPasswordPolicy: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
};

export type { NotificationPayload } from "@/src/types/notifications";
export type { NotificationDeliveryStatus, NotificationChannel, NotificationResult } from "@/src/types/notifications";
export type {
  IdentitySessionRecord,
  IdentityCredentialRecord,
  IdentityRefreshTokenRecord,
  IdentityPasswordResetTokenRecord,
  IdentityRoleAssignmentRecord,
  IdentityWorkspaceAssignmentRecord,
  IdentityAuditRecord,
  IdentitySyncResult,
  IdentitySyncStatus,
} from "./identity-sync";

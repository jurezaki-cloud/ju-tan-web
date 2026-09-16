import type {
  IdentityAuditEvent,
  IdentityCredential,
  IdentityLockout,
  IdentityPasswordResetToken,
  IdentityRefreshToken,
  IdentitySessionEntity,
  IdentityStatusHistory,
  IdentityUserRecord,
  UserRoleAssignment,
  UserWorkspaceAssignment,
} from "@/src/domain/identity";

export type IdentitySyncStatus = "idle" | "synced" | "pending" | "failed";

export type IdentityUserRecordDto = IdentityUserRecord;
export type IdentitySessionRecord = IdentitySessionEntity;
export type IdentityCredentialRecord = IdentityCredential;
export type IdentityRefreshTokenRecord = IdentityRefreshToken;
export type IdentityPasswordResetTokenRecord = IdentityPasswordResetToken;
export type IdentityRoleAssignmentRecord = UserRoleAssignment;
export type IdentityWorkspaceAssignmentRecord = UserWorkspaceAssignment;
export type IdentityAuditRecord = IdentityAuditEvent;
export type IdentityStatusHistoryRecord = IdentityStatusHistory;
export type IdentityLockoutRecord = IdentityLockout;

export type IdentitySyncResult = {
  ok: boolean;
  status: IdentitySyncStatus;
  entityId?: string;
  error?: string;
};

export type {
  IdentityUserRecord,
  IdentitySessionEntity,
  IdentityCredential,
  IdentityRefreshToken,
  IdentityPasswordResetToken,
  UserRoleAssignment,
  UserWorkspaceAssignment,
  IdentityAuditEvent,
};

export type PlatformEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
};

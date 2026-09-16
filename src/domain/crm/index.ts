export type CrmMetadata = Record<string, unknown>;

export interface CrmEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: CrmMetadata;
  tenantId?: string;
  organizationId?: string;
  workspaceId?: string;
  ownerId?: string;
  deletedAt?: string | null;
  version?: number;
}

export interface CrmRecord extends CrmEntity {
  name: string;
  company: string;
  source: string;
  owner: string;
}

export interface Client extends CrmRecord {
  company: string;
  website?: string;
  email?: string;
  phone?: string;
  industry?: string;
  city?: string;
  contactName?: string;
  notes?: string[];
}

export interface Lead extends CrmRecord {
  email?: string;
  phone?: string;
  clientId?: string;
  lastContact?: string;
  source: string;
  pipelineStage?: string;
  score?: number;
  expectedValue?: string;
}

export interface Contact extends CrmEntity {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  clientId?: string;
  leadId?: string;
  name?: string;
  company?: string;
  source?: string;
  owner?: string;
}

export interface Opportunity extends CrmRecord {
  clientId?: string;
  leadId?: string;
  amount?: string;
  closeDate?: string;
  probability?: number;
  stage?: string;
}

export interface Activity extends CrmRecord {
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  projectId?: string;
  type?: string;
  kind?: string;
  subject?: string;
  text?: string;
  dueAt?: string;
  completedAt?: string;
}

export interface Task extends CrmRecord {
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  projectId?: string;
  priority?: string;
  dueAt?: string;
  due?: string;
  assigneeId?: string;
}

export interface Note extends CrmEntity {
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  body?: string;
  pinned?: boolean;
  name?: string;
  company?: string;
  source?: string;
  owner?: string;
}

export interface Quote extends CrmRecord {
  clientId?: string;
  projectId?: string;
  opportunityId?: string;
  number?: string;
  amount?: string;
  currency?: string;
  expiresAt?: string;
  pdfArtifactId?: string;
  title?: string;
}

export interface ProjectLink extends CrmRecord {
  clientId: string;
  projectId: string;
}

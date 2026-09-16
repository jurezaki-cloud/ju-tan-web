export type {
  Activity,
  Client,
  Contact,
  CrmEntity,
  CrmMetadata,
  CrmRecord,
  Lead,
  Note,
  Opportunity,
  ProjectLink,
  Quote,
  Task,
} from "@/src/domain/crm";

export type CrmPermissionKey = "CRM.Read" | "CRM.Write" | "CRM.Archive" | "CRM.Delete" | "CRM.Admin";

export type CrmEntityType =
  | "client"
  | "lead"
  | "contact"
  | "opportunity"
  | "activity"
  | "task"
  | "note"
  | "quote"
  | "offer";

export type CrmSortDirection = "asc" | "desc";

export type CrmQueryParams = {
  search?: string;
  status?: string;
  owner?: string;
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  direction?: CrmSortDirection;
  includeDeleted?: boolean;
};

export type CrmFilters = {
  status?: string;
  owner?: string;
  clientId?: string;
  stage?: string;
  priority?: string;
};

export type CrmSortOption = {
  field: string;
  direction: CrmSortDirection;
};

export type CrmListResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ClientWrite = {
  name: string;
  company?: string;
  website?: string;
  email?: string;
  phone?: string;
  industry?: string;
  city?: string;
  contactName?: string;
  status?: string;
  owner?: string;
  source?: string;
  notes?: string[];
};

export type LeadWrite = {
  name: string;
  company: string;
  email?: string;
  phone?: string;
  clientId?: string;
  status?: string;
  owner?: string;
  source?: string;
  pipelineStage?: string;
  score?: number;
  expectedValue?: string;
  lastContact?: string;
};

export type ContactWrite = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  clientId?: string;
  leadId?: string;
  status?: string;
};

export type OpportunityWrite = {
  name: string;
  company?: string;
  clientId?: string;
  leadId?: string;
  amount?: string;
  closeDate?: string;
  probability?: number;
  stage?: string;
  status?: string;
  owner?: string;
};

export type ActivityWrite = {
  name?: string;
  type?: string;
  subject?: string;
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  dueAt?: string;
  completedAt?: string;
  status?: string;
  text?: string;
};

export type TaskWrite = {
  name: string;
  priority?: string;
  dueAt?: string;
  assigneeId?: string;
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  status?: string;
};

export type NoteWrite = {
  body: string;
  pinned?: boolean;
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  status?: string;
};

export type QuoteWrite = {
  name?: string;
  title?: string;
  number?: string;
  amount?: string;
  currency?: string;
  expiresAt?: string;
  clientId?: string;
  opportunityId?: string;
  projectId?: string;
  status?: string;
};

export type ClientFormDto = ClientWrite;
export type LeadFormDto = LeadWrite;
export type ContactFormDto = ContactWrite;
export type OpportunityFormDto = OpportunityWrite;
export type TaskFormDto = TaskWrite;
export type NoteFormDto = NoteWrite;
export type QuoteFormDto = QuoteWrite;
export type ActivityFormDto = ActivityWrite;

export type CrmSearchHit = {
  type: CrmEntityType;
  id: string;
  title: string;
  subtitle: string;
  route: string;
  relevance: number;
  metadata: Record<string, unknown>;
};

export type CrmSearchQuery = {
  id?: string;
  name?: string;
  company?: string;
  clientId?: string;
  query?: string;
};

export type CrmSummaryPayload = {
  clientId?: string;
  title: string;
  text: string;
  sections: { label: string; value: string }[];
};

export type CrmRelationType = "client" | "lead" | "contact" | "opportunity" | "quote" | "project" | "task";

export type CrmAuditEventType =
  | "ClientCreated"
  | "ClientUpdated"
  | "LeadCreated"
  | "LeadUpdated"
  | "OpportunityCreated"
  | "ActivityCreated"
  | "TaskCreated"
  | "NoteCreated"
  | "QuoteCreated"
  | "RecordArchived"
  | "RecordRestored"
  | "ContactCreated"
  | "QuoteDraftPrepared"
  | "OfferDraftCreated"
  | "OfferCreated"
  | "OfferUpdated"
  | "OfferRevisionCreated"
  | "OfferApprovalRequested"
  | "OfferApprovalGranted"
  | "OfferApprovalRejected"
  | "OfferPdfGenerated"
  | "OfferSent"
  | "OfferArchived"
  | "OfferRestored";

export type CrmTimelineKind =
  | "lead-created"
  | "client-created"
  | "note-added"
  | "activity-completed"
  | "quote-created"
  | "opportunity-stage-changed"
  | "task-due"
  | "ai-action-completed"
  | "audit";

export type CrmTimelineEntry = {
  id: string;
  at: string;
  kind: CrmTimelineKind;
  title: string;
  subtitle?: string;
  clientId?: string;
  metadata?: Record<string, unknown>;
};

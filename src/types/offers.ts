export type {
  Offer,
  OfferApproval,
  OfferAttachment,
  OfferDraft,
  OfferLine,
  OfferRevision,
  OfferSignatureRequest,
  OfferStatus,
  OfferStatusHistory,
  OfferTemplate,
  OfferDecision,
} from "@/src/domain/offers";

export type OfferPermissionKey =
  | "Offer.Read"
  | "Offer.Write"
  | "Offer.Approve"
  | "Offer.Send"
  | "Offer.Archive"
  | "Offer.Admin";

export type OfferQueryParams = {
  search?: string;
  status?: string;
  clientId?: string;
  leadId?: string;
  projectId?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  direction?: "asc" | "desc";
  includeDeleted?: boolean;
};

export type OfferFilters = {
  status?: string;
  clientId?: string;
  leadId?: string;
};

export type OfferSortOption = {
  field: string;
  direction: "asc" | "desc";
};

export type OfferListResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type OfferWrite = {
  title: string;
  clientId?: string;
  leadId?: string;
  projectId?: string;
  opportunityId?: string;
  currency?: string;
  validUntil?: string;
  templateId?: string;
};

export type OfferLineWrite = {
  offerId: string;
  label: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  sortOrder?: number;
};

export type OfferDraftWrite = {
  offerId?: string;
  leadId?: string;
  clientId?: string;
  opportunityId?: string;
  source?: "lead" | "opportunity" | "manual" | "ai";
  notes?: string;
  title?: string;
};

export type OfferRevisionWrite = {
  offerId: string;
  changeSummary: string;
  changedBy?: string;
};

export type OfferApprovalWrite = {
  offerId: string;
  comment?: string;
  approvedBy?: string;
};

export type OfferFormDto = OfferWrite;
export type OfferDraftDto = OfferDraftWrite;
export type OfferRevisionDto = OfferRevisionWrite;
export type OfferApprovalDto = OfferApprovalWrite;
export type OfferLineDto = OfferLineWrite;

export type OfferSearchHit = {
  type: "offer" | "offer-draft" | "revision" | "approval" | "offer-template" | "client" | "lead" | "project" | "artifact";
  id: string;
  title: string;
  subtitle: string;
  route: string;
  relevance: number;
  metadata: Record<string, unknown>;
};

export type OfferTimelineKind =
  | "draft-created"
  | "line-item-added"
  | "revision-created"
  | "approval-requested"
  | "approval-granted"
  | "pdf-generated"
  | "email-drafted"
  | "email-sent"
  | "archived"
  | "audit";

export type OfferTimelineEntry = {
  id: string;
  at: string;
  kind: OfferTimelineKind;
  title: string;
  subtitle?: string;
  offerId: string;
};

export type OfferAuditEventType =
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

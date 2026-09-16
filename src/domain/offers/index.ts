import type { CrmEntity } from "@/src/domain/crm";

export type OfferStatus =
  | "Draft"
  | "InReview"
  | "WaitingApproval"
  | "Approved"
  | "Rejected"
  | "Sent"
  | "Archived";

export type OfferDecision = "pending" | "granted" | "rejected";

export interface Offer extends CrmEntity {
  number: string;
  title: string;
  clientId?: string;
  leadId?: string;
  projectId?: string;
  opportunityId?: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  validUntil?: string;
  issuedAt?: string;
  pdfArtifactId?: string;
  documentId?: string;
  sentAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  emailDraft?: string;
  emailSentTo?: string;
}

export interface OfferLine extends CrmEntity {
  offerId: string;
  label: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
  sortOrder: number;
}

export interface OfferDraft extends CrmEntity {
  offerId: string;
  source: "lead" | "opportunity" | "manual" | "ai";
  aiSummary?: string;
  assumptions?: string;
  notes?: string;
  risks?: string;
}

export interface OfferRevision extends CrmEntity {
  offerId: string;
  revisionNumber: number;
  changeSummary: string;
  changedBy: string;
}

export interface OfferApproval extends CrmEntity {
  offerId: string;
  approvedBy?: string;
  approvedAt?: string;
  decision: OfferDecision;
  comment?: string;
  engineApprovalId?: string;
}

export interface OfferTemplate extends CrmEntity {
  name: string;
  title: string;
  currency: string;
  notes?: string;
  defaultTaxRate: number;
}

export interface OfferAttachment extends CrmEntity {
  offerId: string;
  kind: "PDF" | "DOCX" | "MD" | "JSON" | "email";
  title: string;
  artifactId?: string;
  uri?: string;
}

export interface OfferStatusHistory extends CrmEntity {
  offerId: string;
  fromStatus?: string;
  toStatus: string;
  note?: string;
}

export interface OfferSignatureRequest extends CrmEntity {
  offerId: string;
  requestedFrom?: string;
  signedAt?: string;
}

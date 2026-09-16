export type {
  Document,
  DocumentLink,
  DocumentReference,
  DocumentSummary,
  DocumentTag,
  DocumentVersion,
} from "@/src/domain/documents";

export type DocumentSearchQuery = {
  query?: string;
  clientId?: string;
  projectId?: string;
  format?: string;
};

export type DocumentSummaryPayload = {
  documentId: string;
  text: string;
  audience?: "offer" | "analysis" | "follow-up";
};

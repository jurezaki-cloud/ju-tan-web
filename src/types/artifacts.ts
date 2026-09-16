import type { ArtifactFormat } from "@/src/ai/types/artifact";

export type ArtifactRelationType =
  | "client"
  | "lead"
  | "project"
  | "document"
  | "action"
  | "workflow"
  | "approval";

export type ArtifactLink = {
  artifactId: string;
  clientId?: string;
  projectId?: string;
  leadId?: string;
  documentId?: string;
  ticketId?: string;
  workflowId?: string;
  actionId?: string;
  approvalId?: string;
};

export type ArtifactRef = {
  id: string;
  format: ArtifactFormat;
  title: string;
  uri: string;
  signed?: string;
};

export type ArtifactReference = ArtifactRef & {
  links: ArtifactLink[];
};

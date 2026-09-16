import type { ArtifactFormat } from "@/src/ai/types/artifact";

export type DocumentMetadata = Record<string, unknown>;

export interface Document {
  id: string;
  name: string;
  company: string;
  status: string;
  source: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  metadata: DocumentMetadata;
  format: ArtifactFormat;
  clientId?: string;
  projectId?: string;
  excerpt?: string;
}

export interface DocumentVersion {
  id: string;
  name: string;
  company: string;
  status: string;
  source: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  metadata: DocumentMetadata;
  documentId: string;
  version: number;
}

export interface DocumentTag {
  id: string;
  name: string;
  company: string;
  status: string;
  source: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  metadata: DocumentMetadata;
  documentId: string;
}

export interface DocumentReference {
  id: string;
  name: string;
  company: string;
  status: string;
  source: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  metadata: DocumentMetadata;
  documentId: string;
  uri: string;
  format: ArtifactFormat;
}

export interface DocumentSummary {
  id: string;
  name: string;
  company: string;
  status: string;
  source: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  metadata: DocumentMetadata;
  documentId: string;
  text: string;
  audience?: "offer" | "analysis" | "follow-up";
}

export interface DocumentLink {
  id: string;
  name: string;
  company: string;
  status: string;
  source: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  metadata: DocumentMetadata;
  documentId: string;
  artifactId?: string;
  actionId?: string;
  clientId?: string;
  projectId?: string;
}

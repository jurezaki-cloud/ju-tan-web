import type { Project } from "@/src/domain/project";
import type { Ticket } from "@/src/domain/ticket";
import type { Offer } from "@/src/domain/offer";
import type { Document as PlatformDocument } from "@/src/domain/document";
import type {
  Activity,
  Client,
  Contact,
  Lead,
  Note,
  Opportunity,
  ProjectLink,
  Quote,
  Task,
} from "@/src/domain/crm";
import type {
  Document,
  DocumentReference,
  DocumentSummary,
} from "@/src/domain/documents";
import type { ActivityItem, IntegrationRecord, TaskItem } from "@/src/types/platform";
import type { KnowledgeChunk } from "@/src/ai/types/rag";
import type { Permission } from "@/src/config/permissions";
import type { Role } from "@/src/config/roles";
import type { ArtifactLink, ArtifactRef, ArtifactReference } from "@/src/types/artifacts";
import type { TimelineEntry } from "@/src/types/timeline";
import type { CrmSearchQuery, CrmSummaryPayload } from "@/src/types/crm";

export type { ArtifactLink, ArtifactRef, ArtifactReference } from "@/src/types/artifacts";
export type { TimelineEntry, TimelineKind } from "@/src/types/timeline";
export type { CrmSummaryPayload } from "@/src/types/crm";
export type { DocumentSummaryPayload } from "@/src/types/documents";

export type IntegrationAuditType =
  | "ContextBuilt"
  | "ClientResolved"
  | "LeadResolved"
  | "DocumentRead"
  | "DocumentSummarized"
  | "DocumentLinked"
  | "ArtifactLinked"
  | "KnowledgeFetched"
  | "ArtifactStored"
  | "NotificationPrepared"
  | "SearchExecuted";

export type IntegrationAuditEvent = {
  type: IntegrationAuditType;
  at: string;
  payload?: Record<string, unknown>;
};

export interface IntegrationAudit {
  record(event: IntegrationAuditEvent): void;
  list(): IntegrationAuditEvent[];
}

export type SearchEntityType =
  | "crm"
  | "project"
  | "document"
  | "lead"
  | "quote"
  | "offer"
  | "activity"
  | "ticket"
  | "knowledge"
  | "action"
  | "artifact";

export type SearchHit = {
  id: string;
  type: SearchEntityType;
  source: SearchEntityType;
  title: string;
  subtitle: string;
  snippet: string;
  relevance: number;
  links: string[];
  metadata: Record<string, unknown>;
};

export type NotificationChannel = "in-app" | "email" | "webhook" | "slack" | "teams";

export type NotificationPayload = {
  channel: NotificationChannel;
  title: string;
  body: string;
  to?: string;
  requiresApproval: boolean;
};

export type FileMetadata = {
  id: string;
  name: string;
  mime: string;
  size: number;
  storedAt: string;
};

export type SignedArtifactRef = {
  fileId: string;
  token: string;
  expiresAt: string;
};

export type ContextSnapshot = {
  currentUserId?: string;
  role?: Role;
  permissions: Permission[];
  workspace: string;
  client?: Client;
  project?: Project;
  openDocuments: Document[];
  recentActions: string[];
  knowledgeCollections: string[];
  relatedLeads: Lead[];
  relevantLeads: Lead[];
  relevantDocuments: Document[];
  relatedTickets: Ticket[];
  relatedIntegrations: IntegrationRecord[];
  relatedOffers: Offer[];
  relatedQuotes: Quote[];
  relatedArtifacts: ArtifactRef[];
  openTasks: Task[];
  recentActivity: ActivityItem[];
  recentActivities: Activity[];
  knowledge: KnowledgeChunk[];
  timeline: TimelineEntry[];
  mergedText: string;
};

export type ContextRequest = {
  userId?: string;
  role?: Role;
  permissions?: Permission[];
  workspace?: string;
  clientId?: string;
  projectId?: string;
  conversationId?: string;
  query?: string;
  openDocumentIds?: string[];
  recentActionIds?: string[];
};

export interface ClientLookup {
  list(): import("@/src/domain/client").Client[];
  getById(id: string): import("@/src/domain/client").Client | undefined;
}

export interface LeadLookup {
  list(): import("@/src/domain/lead").Lead[];
  getById(id: string): import("@/src/domain/lead").Lead | undefined;
}

export interface ProjectLookup {
  list(): Project[];
  getById(id: string): Project | undefined;
  listByClient(clientId: string): Project[];
}

export interface TicketLookup {
  list(): Ticket[];
  getById(id: string): Ticket | undefined;
}

export interface DocumentLookup {
  list(): PlatformDocument[];
  listByClient(clientId: string): PlatformDocument[];
  listOffers(): Offer[];
}

export interface CatalogLookup {
  activity(): ActivityItem[];
  tasks(): TaskItem[];
  integrations(): IntegrationRecord[];
}

export interface CrmCatalog {
  clients(): Client[];
  leads(): Lead[];
  contacts(): Contact[];
  opportunities(): Opportunity[];
  activities(): Activity[];
  tasks(): Task[];
  notes(): Note[];
  quotes(): Quote[];
  projectLinks(): ProjectLink[];
}

export interface DocumentCatalog {
  list(): Document[];
  getById(id: string): Document | undefined;
  listByClient(clientId: string): Document[];
  listByProject(projectId: string): Document[];
  versions(documentId: string): import("@/src/domain/documents").DocumentVersion[];
  tags(documentId: string): import("@/src/domain/documents").DocumentTag[];
  references(documentId: string): DocumentReference[];
  summaries(documentId: string): DocumentSummary[];
  links(documentId: string): import("@/src/domain/documents").DocumentLink[];
  artifactLinks(): ArtifactLink[];
  timeline(): TimelineEntry[];
}

export interface CRMAdapter {
  findClient(query: CrmSearchQuery): Client | undefined;
  findLead(query: CrmSearchQuery): Lead | undefined;
  findProject(query: { id?: string; name?: string; clientId?: string }): Project | undefined;
  findOpportunity(query: CrmSearchQuery): Opportunity | undefined;
  listActivities(clientId?: string): Activity[];
  listTasks(clientId?: string): Task[];
  listQuotes(clientId?: string): Quote[];
  listProjectLinks(clientId?: string): ProjectLink[];
  search(query: string): SearchHit[];
  summary(clientId?: string, query?: string): CrmSummaryPayload;
  recentActivity(clientId?: string): ActivityItem[];
  openTasks(): TaskItem[];
  relatedOffers(clientId?: string): Offer[];
}

export interface DocumentAdapter {
  search(query: string): Document[];
  read(id: string): Document | undefined;
  related(documentId: string): Document[];
  summarize(id: string, audience?: DocumentSummary["audience"]): string;
  listByClient(clientId: string): Document[];
  listByProject(projectId: string): Document[];
  linkArtifact(documentId: string, artifactId: string, extra?: Partial<ArtifactLink>): ArtifactLink;
  resolveReference(documentId: string): DocumentReference | undefined;
}

export interface StorageAdapter {
  put(name: string, content: string, mime: string): FileMetadata;
  get(id: string): { meta: FileMetadata; content: string } | undefined;
}

export interface KnowledgeAdapter {
  search(query: string, collection?: string): KnowledgeChunk[];
  collect(query: string, collections: string[]): KnowledgeChunk[];
  rank(query: string, chunks: KnowledgeChunk[]): KnowledgeChunk[];
  prepareContext(query: string, collections?: string[]): string;
}

export interface GlobalSearchAdapter {
  search(query: string): SearchHit[];
}

export interface NotificationAdapter {
  prepare(payload: NotificationPayload): NotificationPayload & { id: string; status: "prepared" | "blocked" };
}

export interface ObjectStoreAdapter extends StorageAdapter {
  readonly provider: "s3" | "azure-blob" | "minio";
}

export interface ArtifactStore {
  link(link: ArtifactLink): ArtifactLink;
  resolve(artifactId: string): ArtifactLink[];
  store(ref: ArtifactRef): ArtifactRef;
  reference(artifactId: string): ArtifactReference | undefined;
  list(): ArtifactRef[];
}

export type IntegrationBundle = {
  crm: CRMAdapter;
  documents: DocumentAdapter;
  storage: StorageAdapter;
  knowledge: KnowledgeAdapter;
  search: GlobalSearchAdapter;
  notifications: NotificationAdapter;
  tickets: TicketLookup;
  catalog: CatalogLookup;
  artifacts: ArtifactStore;
  audit: IntegrationAudit;
  timeline: { list(clientId?: string): TimelineEntry[] };
};

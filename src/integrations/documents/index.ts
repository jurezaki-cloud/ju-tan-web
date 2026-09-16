import type {
  ArtifactStore,
  DocumentAdapter,
  DocumentCatalog,
  IntegrationAudit,
} from "@/src/types/integrations";
import type { ArtifactFormat } from "@/src/ai/types/artifact";
import type { ArtifactLink } from "@/src/types/artifacts";
import { stamp } from "../audit";
import type { IntegrationPolicy } from "../policies";
import type { Role } from "@/src/config/roles";
import type { Document, DocumentSummary } from "@/src/domain/documents";
import type { TimelineEntry } from "@/src/types/timeline";

const formatOf: Record<string, ArtifactFormat> = {
  PDF: "PDF",
  DOCX: "DOCX",
  MD: "MD",
  JSON: "JSON",
  SQL: "SQL",
  API: "API",
  Diagram: "Diagram",
};

export type MockDocumentAdapterDeps = {
  catalog: DocumentCatalog;
  artifacts: ArtifactStore;
  audit: IntegrationAudit;
  policy: IntegrationPolicy;
  role?: Role;
};

export class MockDocumentAdapter implements DocumentAdapter {
  constructor(private readonly deps: MockDocumentAdapterDeps) {}

  search(query: string) {
    if (!this.deps.policy.canReadDocuments(this.deps.role)) return [];
    const q = query.toLowerCase();
    return this.deps.catalog.list().filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.format.toLowerCase().includes(q) ||
        (item.excerpt ?? "").toLowerCase().includes(q)
      );
    });
  }

  read(id: string) {
    if (!this.deps.policy.canReadDocuments(this.deps.role)) return undefined;
    const doc = this.deps.catalog.getById(id);
    if (doc) this.deps.audit.record(stamp("DocumentRead", { id }));
    return doc;
  }

  related(documentId: string) {
    const current = this.deps.catalog.getById(documentId);
    if (!current) return [];
    return this.deps.catalog.list().filter((item) => item.clientId === current.clientId && item.id !== current.id);
  }

  summarize(id: string, audience?: DocumentSummary["audience"]) {
    if (!this.deps.policy.canSummarize(this.deps.role)) return "Povzetek ni dovoljen.";
    const stored = this.deps.catalog.summaries(id).find((item) => !audience || item.audience === audience);
    const doc = this.deps.catalog.getById(id);
    const text = stored?.text
      ?? (doc
        ? `Povzetek ${doc.name} (${doc.format}) za ${doc.company}. ${doc.excerpt ?? ""} Namen: ${audience ?? "analysis"}.`
        : "Dokument ni najden.");
    this.deps.audit.record(stamp("DocumentSummarized", { id, audience }));
    return text;
  }

  listByClient(clientId: string) {
    if (!this.deps.policy.canReadDocuments(this.deps.role)) return [];
    return this.deps.catalog.listByClient(clientId);
  }

  listByProject(projectId: string) {
    if (!this.deps.policy.canReadDocuments(this.deps.role)) return [];
    return this.deps.catalog.listByProject(projectId);
  }

  linkArtifact(documentId: string, artifactId: string, extra: Partial<ArtifactLink> = {}) {
    if (!this.deps.policy.canLink(this.deps.role)) {
      throw new Error("Povezava dokumenta ni dovoljena.");
    }
    const doc = this.deps.catalog.getById(documentId);
    const link = this.deps.artifacts.link({
      artifactId,
      documentId,
      clientId: extra.clientId ?? doc?.clientId,
      projectId: extra.projectId ?? doc?.projectId,
      actionId: extra.actionId,
      workflowId: extra.workflowId,
      approvalId: extra.approvalId,
      leadId: extra.leadId,
    });
    this.deps.audit.record(stamp("ArtifactLinked", { documentId, artifactId }));
    return link;
  }

  resolveReference(documentId: string) {
    return this.deps.catalog.references(documentId)[0];
  }
}

export class DocumentContextProvider {
  constructor(private readonly documents: DocumentAdapter) {}

  forClient(clientId: string) {
    return this.documents.listByClient(clientId);
  }

  forProject(projectId: string) {
    return this.documents.listByProject(projectId);
  }
}

export class DocumentSearchAdapter {
  constructor(private readonly documents: DocumentAdapter) {}

  search(query: string) {
    return this.documents.search(query);
  }
}

export class DocumentSummaryService {
  constructor(private readonly documents: DocumentAdapter) {}

  forOffer(id: string) {
    return this.documents.summarize(id, "offer");
  }

  forAnalysis(id: string) {
    return this.documents.summarize(id, "analysis");
  }

  forFollowUp(id: string) {
    return this.documents.summarize(id, "follow-up");
  }
}

export class DocumentArtifactLinker {
  constructor(private readonly documents: DocumentAdapter) {}

  link(documentId: string, artifactId: string, extra?: Partial<ArtifactLink>) {
    return this.documents.linkArtifact(documentId, artifactId, extra);
  }

  toRef(doc: Document) {
    const format = formatOf[doc.format] ?? doc.format;
    return { id: doc.id, format, title: doc.name, uri: `mock://documents/${doc.id}` };
  }
}

export class DocumentReferenceResolver {
  constructor(private readonly documents: DocumentAdapter) {}

  resolve(documentId: string) {
    return this.documents.resolveReference(documentId);
  }
}

export class DocumentActivityTimeline {
  constructor(private readonly entries: TimelineEntry[]) {}

  list(clientId?: string) {
    const rows = this.entries.filter((item) => item.documentId || item.kind === "document-added" || item.kind === "ai-summary");
    return clientId ? rows.filter((item) => item.clientId === clientId) : rows;
  }
}

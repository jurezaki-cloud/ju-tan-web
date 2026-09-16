import { store } from "./mock/store";
import type {
  Document,
  DocumentLink,
  DocumentReference,
  DocumentSummary,
  DocumentTag,
  DocumentVersion,
} from "@/src/domain/documents";
import type { ArtifactLink } from "@/src/types/artifacts";
import type { TimelineEntry } from "@/src/types/timeline";

export class DocumentCatalogRepository {
  list(): Document[] {
    return store.catalogDocuments;
  }

  getById(id: string): Document | undefined {
    return store.catalogDocuments.find((item) => item.id === id);
  }

  listByClient(clientId: string): Document[] {
    return store.catalogDocuments.filter((item) => item.clientId === clientId);
  }

  listByProject(projectId: string): Document[] {
    return store.catalogDocuments.filter((item) => item.projectId === projectId);
  }

  versions(documentId: string): DocumentVersion[] {
    return store.documentVersions.filter((item) => item.documentId === documentId);
  }

  tags(documentId: string): DocumentTag[] {
    return store.documentTags.filter((item) => item.documentId === documentId);
  }

  references(documentId: string): DocumentReference[] {
    return store.documentReferences.filter((item) => item.documentId === documentId);
  }

  summaries(documentId: string): DocumentSummary[] {
    return store.documentSummaries.filter((item) => item.documentId === documentId);
  }

  links(documentId: string): DocumentLink[] {
    return store.documentLinks.filter((item) => item.documentId === documentId);
  }

  artifactLinks(): ArtifactLink[] {
    return store.catalogArtifactLinks;
  }

  timeline(): TimelineEntry[] {
    return store.catalogTimeline;
  }
}

export const documentCatalogRepository = new DocumentCatalogRepository();

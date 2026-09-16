import type {
  GlobalSearchAdapter,
  SearchHit,
  CRMAdapter,
  DocumentAdapter,
  KnowledgeAdapter,
  IntegrationAudit,
  ArtifactRef,
  ProjectLookup,
  TicketLookup,
} from "@/src/types/integrations";
import { stamp } from "../audit";
import { offerService } from "@/src/services/OfferService";

function asHit(
  type: SearchHit["type"],
  id: string,
  title: string,
  subtitle: string,
  relevance: number,
  links: string[] = [],
  metadata: Record<string, unknown> = {},
): SearchHit {
  return { id, type, source: type, title, subtitle, snippet: subtitle, relevance, links, metadata };
}

export class MockGlobalSearchAdapter implements GlobalSearchAdapter {
  constructor(
    private readonly crm: CRMAdapter,
    private readonly projects: ProjectLookup,
    private readonly documents: DocumentAdapter,
    private readonly tickets: TicketLookup,
    private readonly knowledge: KnowledgeAdapter,
    private readonly audit: IntegrationAudit,
    private readonly artifacts: () => ArtifactRef[] = () => [],
    private readonly actions: () => { id: string; title: string }[] = () => [],
  ) {}

  search(query: string): SearchHit[] {
    const q = query.toLowerCase();
    const hits: SearchHit[] = [...this.crm.search(query)];
    const offers = offerService.search(query);
    if (offers.ok) {
      for (const hit of offers.data) {
        const type = hit.type === "offer" || hit.type === "artifact" ? hit.type : hit.type === "project" ? "project" : "quote";
        hits.push(asHit(type, hit.id, hit.title, hit.subtitle, hit.relevance, [hit.route], hit.metadata));
      }
    }
    for (const project of this.projects.list()) {
      if (project.name.toLowerCase().includes(q)) {
        hits.push(asHit("project", project.id, project.name, project.status, 0.75, [], { clientId: project.clientId }));
      }
    }
    for (const doc of this.documents.search(query)) {
      hits.push(asHit("document", doc.id, doc.name, doc.format, 0.8, [`mock://documents/${doc.id}`], { clientId: doc.clientId }));
    }
    for (const ticket of this.tickets.list()) {
      if (ticket.title.toLowerCase().includes(q)) {
        hits.push(asHit("ticket", ticket.id, ticket.title, ticket.status, 0.5));
      }
    }
    for (const chunk of this.knowledge.search(query)) {
      hits.push(asHit("knowledge", chunk.id, chunk.collection, chunk.text.slice(0, 80), chunk.score ?? 0.4));
    }
    for (const action of this.actions()) {
      if (action.title.toLowerCase().includes(q)) {
        hits.push(asHit("action", action.id, action.title, "action", 0.45));
      }
    }
    for (const artifact of this.artifacts()) {
      if (artifact.title.toLowerCase().includes(q)) {
        hits.push(asHit("artifact", artifact.id, artifact.title, artifact.format, 0.6, [artifact.uri]));
      }
    }
    this.audit.record(stamp("SearchExecuted", { query, count: hits.length }));
    return hits.sort((a, b) => b.relevance - a.relevance);
  }
}

export class SearchContextProvider {
  constructor(private readonly search: GlobalSearchAdapter) {}

  forQuery(query: string) {
    return this.search.search(query);
  }
}

export class SearchIndexProvider {
  constructor(private readonly search: GlobalSearchAdapter) {}

  query(query: string) {
    return this.search.search(query);
  }
}

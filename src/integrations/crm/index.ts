import type {
  CRMAdapter,
  CrmCatalog,
  CatalogLookup,
  ClientLookup,
  DocumentLookup,
  IntegrationAudit,
  LeadLookup,
  ProjectLookup,
  SearchHit,
} from "@/src/types/integrations";
import { stamp } from "../audit";
import type { IntegrationPolicy } from "../policies";
import type { Role } from "@/src/config/roles";
import type { ArtifactLink, ArtifactRef } from "@/src/types/artifacts";
import type { TimelineEntry } from "@/src/types/timeline";
import type { ArtifactStore } from "@/src/types/integrations";

function matches(value: string, query?: string): boolean {
  if (!query) return true;
  return value.toLowerCase().includes(query.toLowerCase());
}

function score(haystack: string, query: string): number {
  const h = haystack.toLowerCase();
  const q = query.toLowerCase();
  if (!q) return 0.2;
  if (h === q) return 1;
  if (h.startsWith(q)) return 0.9;
  if (h.includes(q)) return 0.7;
  return 0;
}

function hit(
  type: SearchHit["type"],
  id: string,
  title: string,
  subtitle: string,
  query: string,
  links: string[] = [],
  metadata: Record<string, unknown> = {},
): SearchHit {
  const relevance = Math.max(score(title, query), score(subtitle, query));
  return { id, type, source: type, title, subtitle, snippet: subtitle, relevance, links, metadata };
}

export type MockCRMAdapterDeps = {
  clients: ClientLookup;
  leads: LeadLookup;
  projects: ProjectLookup;
  documents: DocumentLookup;
  catalog: CatalogLookup;
  crm: CrmCatalog;
  audit: IntegrationAudit;
  policy: IntegrationPolicy;
  role?: Role;
};

export class MockCRMAdapter implements CRMAdapter {
  constructor(private readonly deps: MockCRMAdapterDeps) {}

  findClient(query: { id?: string; name?: string }) {
    if (!this.deps.policy.canReadCrm(this.deps.role)) return undefined;
    const found = query.id
      ? this.deps.crm.clients().find((item) => item.id === query.id)
      : this.deps.crm.clients().find((item) => matches(item.name, query.name) || matches(item.company, query.name));
    if (found) this.deps.audit.record(stamp("ClientResolved", { id: found.id }));
    return found;
  }

  findLead(query: { id?: string; name?: string }) {
    if (!this.deps.policy.canReadCrm(this.deps.role)) return undefined;
    const found = query.id
      ? this.deps.crm.leads().find((item) => item.id === query.id)
      : this.deps.crm
          .leads()
          .find((item) => matches(item.name, query.name) || matches(item.company, query.name));
    if (found) this.deps.audit.record(stamp("LeadResolved", { id: found.id }));
    return found;
  }

  findProject(query: { id?: string; name?: string; clientId?: string }) {
    if (query.id) return this.deps.projects.getById(query.id);
    const list = query.clientId ? this.deps.projects.listByClient(query.clientId) : this.deps.projects.list();
    return list.find((item) => matches(item.name, query.name));
  }

  findOpportunity(query: { id?: string; name?: string; clientId?: string }) {
    if (!this.deps.policy.canReadCrm(this.deps.role)) return undefined;
    if (query.id) return this.deps.crm.opportunities().find((item) => item.id === query.id);
    return this.deps.crm.opportunities().find((item) => {
      const byClient = query.clientId ? item.clientId === query.clientId : true;
      return byClient && (matches(item.name, query.name) || matches(item.company, query.name));
    });
  }

  listActivities(clientId?: string) {
    const rows = this.deps.crm.activities();
    return clientId ? rows.filter((item) => item.clientId === clientId) : rows;
  }

  listTasks(clientId?: string) {
    const rows = this.deps.crm.tasks();
    return clientId ? rows.filter((item) => item.clientId === clientId) : rows;
  }

  listQuotes(clientId?: string) {
    const rows = this.deps.crm.quotes();
    return clientId ? rows.filter((item) => item.clientId === clientId) : rows;
  }

  listProjectLinks(clientId?: string) {
    const rows = this.deps.crm.projectLinks();
    return clientId ? rows.filter((item) => item.clientId === clientId) : rows;
  }

  search(query: string): SearchHit[] {
    const hits: SearchHit[] = [];
    for (const client of this.deps.crm.clients()) {
      if (score(`${client.name} ${client.company}`, query) > 0.2) {
        hits.push(hit("crm", client.id, client.name, client.company, query, [], { status: client.status }));
      }
    }
    for (const lead of this.deps.crm.leads()) {
      if (score(`${lead.name} ${lead.company}`, query) > 0.2) {
        hits.push(hit("lead", lead.id, lead.name, lead.company, query, [], { clientId: lead.clientId }));
      }
    }
    for (const quote of this.deps.crm.quotes()) {
      if (score(`${quote.name} ${quote.title ?? ""}`, query) > 0.2) {
        hits.push(hit("quote", quote.id, quote.title ?? quote.name, quote.amount ?? "", query, [], { clientId: quote.clientId }));
      }
    }
    for (const activity of this.deps.crm.activities()) {
      if (score(`${activity.name} ${activity.text ?? ""}`, query) > 0.2) {
        hits.push(hit("activity", activity.id, activity.name, activity.text ?? "", query, [], { kind: activity.kind }));
      }
    }
    return hits.sort((a, b) => b.relevance - a.relevance);
  }

  summary(clientId?: string, query?: string) {
    const client = clientId ? this.findClient({ id: clientId }) : this.findClient({ name: query });
    const quotes = this.listQuotes(client?.id);
    const tasks = this.listTasks(client?.id);
    const activities = this.listActivities(client?.id).slice(0, 3);
    const sections = [
      { label: "Klient", value: client ? `${client.name} (${client.status})` : "Ni določen" },
      { label: "Ponudbe", value: quotes.map((item) => `${item.title ?? item.name} ${item.amount ?? ""}`).join("; ") || "—" },
      { label: "Naloge", value: tasks.map((item) => item.name).join("; ") || "—" },
      { label: "Aktivnosti", value: activities.map((item) => item.name).join("; ") || "—" },
    ];
    return {
      clientId: client?.id,
      title: client ? `CRM kontekst: ${client.name}` : "CRM kontekst",
      text: sections.map((item) => `${item.label}: ${item.value}`).join("\n"),
      sections,
    };
  }

  recentActivity(clientId?: string) {
    const rows = this.deps.catalog.activity();
    if (!clientId) return rows.slice(0, 6);
    const client = this.deps.clients.getById(clientId);
    if (!client) return rows.slice(0, 4);
    return rows.filter((item) => item.text.includes(client.name)).slice(0, 6);
  }

  openTasks() {
    return this.deps.catalog.tasks();
  }

  relatedOffers(clientId?: string) {
    const offers = this.deps.documents.listOffers();
    return clientId ? offers.filter((item) => item.clientId === clientId) : offers;
  }
}

export class CRMContextProvider {
  constructor(private readonly crm: CRMAdapter) {}

  forClient(clientId?: string) {
    const client = clientId ? this.crm.findClient({ id: clientId }) : undefined;
    return {
      client,
      leads: client ? this.crm.search(client.name).filter((item) => item.type === "lead") : [],
      activity: this.crm.listActivities(clientId),
      tasks: this.crm.listTasks(clientId),
      quotes: this.crm.listQuotes(clientId),
      projects: this.crm.listProjectLinks(clientId),
      summary: this.crm.summary(clientId),
    };
  }
}

export class CRMEnrichmentService {
  constructor(private readonly crm: CRMAdapter) {}

  enrich(query: string) {
    return {
      client: this.crm.findClient({ name: query }),
      lead: this.crm.findLead({ name: query }),
      project: this.crm.findProject({ name: query }),
      opportunity: this.crm.findOpportunity({ name: query }),
      summary: this.crm.summary(undefined, query),
    };
  }
}

export class CRMSearchAdapter {
  constructor(private readonly crm: CRMAdapter) {}

  search(query: string) {
    return this.crm.search(query);
  }
}

export class CRMArtifactLinker {
  constructor(private readonly artifacts: ArtifactStore) {}

  linkClient(artifactId: string, clientId: string, extra: Partial<ArtifactLink> = {}) {
    return this.artifacts.link({ artifactId, clientId, ...extra });
  }

  toRef(id: string, title: string): ArtifactRef {
    return { id, format: "JSON", title, uri: `mock://crm/${id}` };
  }
}

export class CRMActivityTimeline {
  constructor(private readonly entries: TimelineEntry[]) {}

  list(clientId?: string) {
    const rows = [...this.entries].sort((a, b) => b.at.localeCompare(a.at));
    return clientId ? rows.filter((item) => item.clientId === clientId) : rows;
  }
}

import type {
  CatalogLookup,
  ClientLookup,
  CrmCatalog,
  DocumentCatalog,
  DocumentLookup,
  IntegrationBundle,
  LeadLookup,
  ProjectLookup,
  TicketLookup,
} from "@/src/types/integrations";
import { InMemoryIntegrationAudit } from "./audit";
import { IntegrationPolicy } from "./policies";
import { CRMActivityTimeline, CRMArtifactLinker, MockCRMAdapter } from "./crm";
import { DocumentArtifactLinker, MockDocumentAdapter } from "./documents";
import { FileLinkService, MockStorageAdapter, SignedArtifactService } from "./storage";
import { MockKnowledgeAdapter, RagPipeline } from "./knowledge";
import { MockGlobalSearchAdapter } from "./search";
import { MockNotificationAdapter } from "./notifications";
import { ArtifactRegistry, AuditedArtifactRegistry } from "./artifacts";
import type { Role } from "@/src/config/roles";

export type IntegrationPorts = {
  clients: ClientLookup;
  leads: LeadLookup;
  projects: ProjectLookup;
  tickets: TicketLookup;
  documents: DocumentLookup;
  catalog: CatalogLookup;
  crmCatalog: CrmCatalog;
  documentCatalog: DocumentCatalog;
  role?: Role;
};

export function createIntegrations(ports: IntegrationPorts): IntegrationBundle & {
  rag: RagPipeline;
  files: FileLinkService;
  signed: SignedArtifactService;
  linker: DocumentArtifactLinker;
  crmLinker: CRMArtifactLinker;
} {
  const audit = new InMemoryIntegrationAudit();
  const policy = new IntegrationPolicy();
  const registry = new ArtifactRegistry([...ports.documentCatalog.artifactLinks()]);
  for (const doc of ports.documentCatalog.list()) {
    registry.store({
      id: `art-${doc.id}`,
      format: doc.format,
      title: doc.name,
      uri: `mock://documents/${doc.id}`,
    });
  }
  const artifacts = new AuditedArtifactRegistry(registry, audit);
  const crm = new MockCRMAdapter({
    clients: ports.clients,
    leads: ports.leads,
    projects: ports.projects,
    documents: ports.documents,
    catalog: ports.catalog,
    crm: ports.crmCatalog,
    audit,
    policy,
    role: ports.role,
  });
  const documents = new MockDocumentAdapter({
    catalog: ports.documentCatalog,
    artifacts,
    audit,
    policy,
    role: ports.role,
  });
  const storage = new MockStorageAdapter();
  const knowledge = new MockKnowledgeAdapter(ports.documents, audit);
  const search = new MockGlobalSearchAdapter(
    crm,
    ports.projects,
    documents,
    ports.tickets,
    knowledge,
    audit,
    () => registry.list(),
  );
  const notifications = new MockNotificationAdapter(policy, audit);
  const timeline = new CRMActivityTimeline(ports.documentCatalog.timeline());
  return {
    crm,
    documents,
    storage,
    knowledge,
    search,
    notifications,
    tickets: ports.tickets,
    catalog: ports.catalog,
    artifacts,
    audit,
    timeline,
    rag: new RagPipeline(knowledge),
    files: new FileLinkService(storage, audit, policy),
    signed: new SignedArtifactService(),
    linker: new DocumentArtifactLinker(documents),
    crmLinker: new CRMArtifactLinker(artifacts),
  };
}

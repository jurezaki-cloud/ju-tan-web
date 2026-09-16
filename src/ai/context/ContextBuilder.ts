import type { ContextRequest, ContextSnapshot, IntegrationBundle } from "@/src/types/integrations";
import { Permission } from "@/src/config/permissions";
import { stamp } from "@/src/integrations/audit";
import { ContextMergeStrategy, ContextPolicy, ContextResolver } from "./policy";

export class ContextBuilder {
  constructor(
    private readonly integrations: IntegrationBundle,
    private readonly policy = new ContextPolicy(),
    private readonly merge = new ContextMergeStrategy(),
    private readonly resolver = new ContextResolver(),
  ) {}

  async build(request: ContextRequest): Promise<ContextSnapshot> {
    const role = request.role;
    const canCrm = role ? this.policy.allow(role, Permission.CRM) || this.policy.allow(role, Permission.CRMRead) : true;
    const canDocs = role ? this.policy.allow(role, Permission.Documents) || this.policy.allow(role, Permission.AI) : true;

    const client = canCrm ? this.integrations.crm.findClient({ id: request.clientId, name: request.query }) : undefined;
    const project = request.projectId
      ? this.integrations.crm.findProject({ id: request.projectId })
      : request.query
        ? this.integrations.crm.findProject({ name: request.query, clientId: client?.id })
        : undefined;
    const relevantDocuments = canDocs
      ? client
        ? this.integrations.documents.listByClient(client.id)
        : request.query
          ? this.integrations.documents.search(request.query)
          : []
      : [];
    const openDocuments = canDocs
      ? (request.openDocumentIds ?? []).map((id) => this.integrations.documents.read(id)).filter((item): item is NonNullable<typeof item> => Boolean(item))
      : [];
    const docs = openDocuments.length > 0 ? openDocuments : relevantDocuments.slice(0, 5);
    const lead = canCrm
      ? this.integrations.crm.findLead({ name: client?.company ?? request.query })
      : undefined;
    const relatedLeads = lead ? [lead] : [];
    const extraLeads = canCrm
      ? this.integrations.crm.search(request.query ?? client?.name ?? "").filter((item) => item.type === "lead")
      : [];
    const relatedTickets = client
      ? this.integrations.tickets.list().filter((item) => item.requester === client.name).slice(0, 5)
      : [];
    const knowledge = this.integrations.knowledge.search(request.query ?? client?.name ?? "", undefined);
    const rag = this.integrations.knowledge.prepareContext(request.query ?? "", request.workspace ? [request.workspace] : undefined);
    const crmSummary = canCrm ? this.integrations.crm.summary(client?.id, request.query) : undefined;
    const quotes = client ? this.integrations.crm.listQuotes(client.id) : [];
    const tasks = this.integrations.crm.listTasks(client?.id);
    const activities = this.integrations.crm.listActivities(client?.id);
    const relatedArtifacts = this.integrations.artifacts.list().filter((ref) =>
      this.integrations.artifacts.resolve(ref.id).some((link) => link.clientId === client?.id || link.projectId === project?.id),
    );
    const timeline = this.integrations.timeline.list(client?.id);
    const docSummaries = docs.slice(0, 3).map((item) => this.integrations.documents.summarize(item.id, "analysis"));
    const crmText = crmSummary?.text ?? "";
    const docText = docs.map((item) => `${item.name} (${item.format})`).join(", ");
    const quoteText = quotes.map((item) => `${item.title ?? item.name} ${item.amount ?? ""}`).join(", ");

    const snapshot: ContextSnapshot = {
      currentUserId: request.userId,
      role,
      permissions: request.permissions ?? [],
      workspace: this.resolver.pick(request.workspace, "chat"),
      client,
      project,
      openDocuments: docs,
      recentActions: request.recentActionIds ?? [],
      knowledgeCollections: ["docs", "crm", "erp", "api"],
      relatedLeads,
      relevantLeads: relatedLeads,
      relevantDocuments: relevantDocuments,
      relatedTickets,
      relatedIntegrations: this.integrations.catalog.integrations(),
      relatedOffers: client ? this.integrations.crm.relatedOffers(client.id) : [],
      relatedQuotes: quotes,
      relatedArtifacts,
      openTasks: tasks,
      recentActivity: this.integrations.crm.recentActivity(client?.id),
      recentActivities: activities,
      knowledge,
      timeline,
      mergedText: this.merge.merge([
        crmText,
        extraLeads.length ? `Leadi: ${extraLeads.map((item) => item.title).join(", ")}` : "",
        docText ? `Dokumenti: ${docText}` : "",
        quoteText ? `Ponudbe: ${quoteText}` : "",
        docSummaries.join("\n"),
        rag,
      ]),
    };
    this.integrations.audit.record(stamp("ContextBuilt", { workspace: snapshot.workspace, clientId: client?.id }));
    return snapshot;
  }
}

export { ContextMergeStrategy, ContextPolicy, ContextResolver } from "./policy";
export type { ContextSnapshot, ContextRequest } from "@/src/types/integrations";

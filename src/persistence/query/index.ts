import type { PaginationResult, QueryOptions, TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { ClientMapper, DocumentMapper, LeadMapper, ProjectMapper, TicketMapper, UserMapper } from "../mapping";
import { store } from "@/src/repositories/mock/store";
import type { DashboardSummary } from "@/src/types/platform";

export class QueryLayer {
  constructor(
    private readonly tables: InMemoryTables,
    private readonly scope: TenantScope,
  ) {}

  paginate<T>(items: T[], options: QueryOptions = {}): PaginationResult<T> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? (items.length || 20);
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
  }

  dashboardStats(): DashboardSummary {
    const projects = this.tables.list("projects", this.scope).map((row) => new ProjectMapper().toDomain(row));
    const clients = this.tables.list("clients", this.scope).map((row) => new ClientMapper().toDomain(row));
    const tickets = this.tables.list("tickets", this.scope).map((row) => new TicketMapper().toDomain(row));
    return {
      activeProjects: projects.filter((item) => item.status !== "Zaključeno").length,
      newClients: clients.filter((item) => item.status === "Novo").length,
      openTickets: tickets.filter((item) => item.status === "Open").length,
      automations: store.ai.automations,
      revenue: store.revenue,
      tasks: store.tasks,
      activity: store.activity,
    };
  }

  crmPipeline(options?: QueryOptions) {
    return this.paginate(this.tables.list("leads", this.scope).map((row) => new LeadMapper().toDomain(row)), options);
  }

  documentList(options?: QueryOptions) {
    return this.paginate(this.tables.list("documents", this.scope).map((row) => new DocumentMapper().toDomain(row)), options);
  }

  projectList(options?: QueryOptions) {
    return this.paginate(this.tables.list("projects", this.scope).map((row) => new ProjectMapper().toDomain(row)), options);
  }

  recentActivity(options?: QueryOptions) {
    return this.paginate(this.tables.list("activities", this.scope), options);
  }

  actionHistory(options?: QueryOptions) {
    return this.paginate(this.tables.list("audit_events", this.scope), options);
  }

  auditTrail(options?: QueryOptions) {
    return this.actionHistory(options);
  }

  knowledgeCollections(options?: QueryOptions) {
    return this.paginate(this.tables.list("knowledge_collections", this.scope), options);
  }

  sessionOverview(options?: QueryOptions) {
    return this.paginate(this.tables.list("sessions", this.scope), options);
  }

  users(options?: QueryOptions) {
    return this.paginate(this.tables.list("users", this.scope).map((row) => new UserMapper().toDomain(row)), options);
  }

  tickets(options?: QueryOptions) {
    return this.paginate(this.tables.list("tickets", this.scope).map((row) => new TicketMapper().toDomain(row)), options);
  }
}

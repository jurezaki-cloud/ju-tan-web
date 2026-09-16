import type { RepositoryAdapter, TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceTracer } from "../observability";
import { PersistencePolicy, InMemoryRepositoryCache } from "../security";
import { MappedRepository } from "../repositories/MappedRepository";
import {
  ArtifactMapper,
  AuditMapper,
  ClientMapper,
  DocumentMapper,
  JsonEntityMapper,
  LeadMapper,
  ProjectMapper,
  SessionMapper,
  TicketMapper,
  UserMapper,
} from "../mapping";
import { ClientMapper as PgClientMapper } from "../mappers/client.mapper";
import { LeadMapper as PgLeadMapper } from "../mappers/lead.mapper";
import { ProjectMapper as PgProjectMapper } from "../mappers/project.mapper";
import { TicketMapper as PgTicketMapper } from "../mappers/ticket.mapper";
import { DocumentMapper as PgDocumentMapper } from "../mappers/document.mapper";
import { UserMapper as PgUserMapper } from "../mappers/user.mapper";
import { SessionMapper as PgSessionMapper } from "../mappers/session.mapper";
import { AuditMapper as PgAuditMapper } from "../mappers/audit.mapper";
import { NotificationMapper as PgNotificationMapper } from "../mappers/notification.mapper";
import { ArtifactMapper as PgArtifactMapper } from "../mappers/artifact.mapper";
import { PgJsonMapper } from "../mappers/json.mapper";
import { CompatiblePostgresDriver } from "../postgres/driver";
import { PostgresRepository } from "../postgres/repository";
import { SqlQueryBuilder } from "../postgres/query-builder";
import { PostgresRowMapper } from "../postgres/mapper";
import type { Client } from "@/src/domain/client";
import type { Lead } from "@/src/domain/lead";
import type { Project } from "@/src/domain/project";
import type { Ticket } from "@/src/domain/ticket";
import type { User } from "@/src/domain/user";
import type { Document } from "@/src/domain/document";
import type {
  Activity as CrmActivity,
  Contact as CrmContact,
  CrmEntity,
  Note as CrmNote,
  Opportunity as CrmOpportunity,
  Quote as CrmQuote,
  Task as CrmTask,
} from "@/src/domain/crm";
import { CrmEntityMapper } from "../mappers/crm.mapper";
import { PgCrmMapper } from "../mappers/pg-crm.mapper";
import type {
  Offer,
  OfferApproval,
  OfferAttachment,
  OfferDraft,
  OfferLine,
  OfferRevision,
  OfferStatusHistory,
  OfferTemplate,
} from "@/src/domain/offers";

export type RepositoryGraph = {
  clients: RepositoryAdapter<Client>;
  leads: RepositoryAdapter<Lead>;
  projects: RepositoryAdapter<Project>;
  tickets: RepositoryAdapter<Ticket>;
  documents: RepositoryAdapter<Document>;
  users: RepositoryAdapter<User>;
  artifacts: RepositoryAdapter<{ id: string }>;
  sessions: RepositoryAdapter<{ id: string }>;
  audit: RepositoryAdapter<{ id: string }>;
  notifications: RepositoryAdapter<{ id: string }>;
  contacts: RepositoryAdapter<CrmContact>;
  opportunities: RepositoryAdapter<CrmOpportunity>;
  activities: RepositoryAdapter<CrmActivity>;
  tasks: RepositoryAdapter<CrmTask>;
  notes: RepositoryAdapter<CrmNote>;
  quotes: RepositoryAdapter<CrmQuote>;
  offers: RepositoryAdapter<Offer>;
  offerLines: RepositoryAdapter<OfferLine>;
  offerDrafts: RepositoryAdapter<OfferDraft>;
  offerRevisions: RepositoryAdapter<OfferRevision>;
  offerApprovals: RepositoryAdapter<OfferApproval>;
  offerTemplates: RepositoryAdapter<OfferTemplate>;
  offerAttachments: RepositoryAdapter<OfferAttachment>;
  offerStatusHistory: RepositoryAdapter<OfferStatusHistory>;
  invites: RepositoryAdapter<{ id: string; status: string }>;
  inviteTokens: RepositoryAdapter<{ id: string; status: string }>;
  inviteAcceptances: RepositoryAdapter<{ id: string; status: string }>;
  roleAssignments: RepositoryAdapter<{ id: string; status: string }>;
  workspaceAssignments: RepositoryAdapter<{ id: string; status: string }>;
  userStatusHistory: RepositoryAdapter<{ id: string; status: string }>;
  adminActions: RepositoryAdapter<{ id: string; status: string }>;
  userAudit: RepositoryAdapter<{ id: string; status: string }>;
  notificationDeliveries: RepositoryAdapter<{ id: string; status: string }>;
  notificationTemplates: RepositoryAdapter<{ id: string; status: string }>;
  notificationRetries: RepositoryAdapter<{ id: string; status: string }>;
  rateLimitBuckets: RepositoryAdapter<{ id: string; status: string }>;
  inviteAttempts: RepositoryAdapter<{ id: string; status: string }>;
  inviteSecurity: RepositoryAdapter<{ id: string; status: string }>;
  abuseFlags: RepositoryAdapter<{ id: string; status: string }>;
  rateLimitMaintenance: RepositoryAdapter<{ id: string; status: string }>;
  proxyAnomalies: RepositoryAdapter<{ id: string; status: string }>;
  rateLimitStoreHealth: RepositoryAdapter<{ id: string; status: string }>;
  identityUsers: RepositoryAdapter<{ id: string; status: string }>;
  identitySessions: RepositoryAdapter<{ id: string; status: string }>;
  identityCredentials: RepositoryAdapter<{ id: string; status: string }>;
  identityRefreshTokens: RepositoryAdapter<{ id: string; status: string }>;
  identityPasswordResetTokens: RepositoryAdapter<{ id: string; status: string }>;
  identityRoleAssignments: RepositoryAdapter<{ id: string; status: string }>;
  identityWorkspaceAssignments: RepositoryAdapter<{ id: string; status: string }>;
  identityAuditEvents: RepositoryAdapter<{ id: string; status: string }>;
  identityStatusHistory: RepositoryAdapter<{ id: string; status: string }>;
  identityLockouts: RepositoryAdapter<{ id: string; status: string }>;
};

export type BindRepositoriesInput = {
  usePostgres: boolean;
  tables: InMemoryTables;
  tenant: TenantScope;
  pgDriver: CompatiblePostgresDriver;
  tracer: PersistenceTracer;
  policy: PersistencePolicy;
  cache: InMemoryRepositoryCache;
  sync: () => void;
};

export function bindMockRepositories(input: Omit<BindRepositoriesInput, "usePostgres" | "pgDriver">): RepositoryGraph {
  return bindRepositories({ ...input, usePostgres: false, pgDriver: undefined as never });
}

export function bindPostgresRepositories(input: BindRepositoriesInput): RepositoryGraph {
  return bindRepositories({ ...input, usePostgres: true });
}

export function bindFallbackRepositories(input: Omit<BindRepositoriesInput, "usePostgres" | "pgDriver">): RepositoryGraph {
  return bindMockRepositories(input);
}

export function bindRepositories(input: BindRepositoriesInput): RepositoryGraph {
  const { tables, tenant, tracer, policy, cache, sync, pgDriver, usePostgres } = input;
  const builder = new SqlQueryBuilder();
  const rows = new PostgresRowMapper();
  const clients: RepositoryAdapter<Client> = usePostgres
    ? new PostgresRepository("clients", pgDriver, new PgClientMapper(), tenant, builder, rows, policy, tracer, sync)
    : new MappedRepository("clients", tables, new ClientMapper(), tenant, tracer, policy, cache, sync);
  const leads: RepositoryAdapter<Lead> = usePostgres
    ? new PostgresRepository("leads", pgDriver, new PgLeadMapper(), tenant, builder, rows, policy, tracer, sync)
    : new MappedRepository("leads", tables, new LeadMapper(), tenant, tracer, policy, cache, sync);
  const projects: RepositoryAdapter<Project> = usePostgres
    ? new PostgresRepository("projects", pgDriver, new PgProjectMapper(), tenant, builder, rows, policy, tracer, sync)
    : new MappedRepository("projects", tables, new ProjectMapper(), tenant, tracer, policy, cache, sync);
  const tickets: RepositoryAdapter<Ticket> = usePostgres
    ? new PostgresRepository("tickets", pgDriver, new PgTicketMapper(), tenant, builder, rows, policy, tracer, sync)
    : new MappedRepository("tickets", tables, new TicketMapper(), tenant, tracer, policy, cache, sync);
  const documents: RepositoryAdapter<Document> = usePostgres
    ? new PostgresRepository("documents", pgDriver, new PgDocumentMapper(), tenant, builder, rows, policy, tracer, sync)
    : new MappedRepository("documents", tables, new DocumentMapper(), tenant, tracer, policy, cache, sync);
  const users: RepositoryAdapter<User> = usePostgres
    ? new PostgresRepository("users", pgDriver, new PgUserMapper(), tenant, builder, rows, policy, tracer, sync)
    : new MappedRepository("users", tables, new UserMapper(), tenant, tracer, policy, cache, sync);
  const artifacts: RepositoryAdapter<{ id: string }> = usePostgres
    ? new PostgresRepository("artifacts", pgDriver, new PgArtifactMapper(), tenant, builder, rows, policy, tracer, sync)
    : new MappedRepository("artifacts", tables, new ArtifactMapper(), tenant, tracer, policy, cache, sync);
  const sessions: RepositoryAdapter<{ id: string }> = usePostgres
    ? new PostgresRepository("sessions", pgDriver, new PgSessionMapper(), tenant, builder, rows, policy, tracer)
    : new MappedRepository("sessions", tables, new SessionMapper(), tenant, tracer, policy, cache);
  const audit: RepositoryAdapter<{ id: string }> = usePostgres
    ? new PostgresRepository("audit_events", pgDriver, new PgAuditMapper(), tenant, builder, rows, policy, tracer)
    : new MappedRepository("audit_events", tables, new AuditMapper(), tenant, tracer, policy, cache);
  const notifications: RepositoryAdapter<{ id: string }> = usePostgres
    ? new PostgresRepository("notification_events", pgDriver, new PgNotificationMapper(), tenant, builder, rows, policy, tracer)
    : new MappedRepository("notification_events", tables, new AuditMapper(), tenant, tracer, policy, cache);
  const bindCrm = <T extends CrmEntity>(
    table:
      | "contacts"
      | "opportunities"
      | "activities"
      | "tasks"
      | "notes"
      | "quotes"
      | "offers"
      | "offer_lines"
      | "offer_drafts"
      | "offer_revisions"
      | "offer_approvals"
      | "offer_templates"
      | "offer_attachments"
      | "offer_status_history",
  ): RepositoryAdapter<T> =>
    (usePostgres
      ? new PostgresRepository(table, pgDriver, new PgCrmMapper<T>(), tenant, builder, rows, policy, tracer, sync)
      : new MappedRepository(table, tables, new CrmEntityMapper<T>(), tenant, tracer, policy, cache, sync)) as RepositoryAdapter<T>;

  const bindJson = (
    table:
      | "invites"
      | "invite_tokens"
      | "invite_acceptances"
      | "role_assignments"
      | "workspace_assignments"
      | "user_status_history"
      | "admin_actions"
      | "user_audit_events"
      | "notification_deliveries"
      | "notification_templates"
      | "notification_retries"
      | "rate_limit_buckets"
      | "invite_attempts"
      | "invite_security"
      | "abuse_flags"
      | "rate_limit_maintenance"
      | "proxy_anomalies"
      | "rate_limit_store_health"
      | "identity_users"
      | "identity_sessions"
      | "identity_credentials"
      | "identity_refresh_tokens"
      | "identity_password_reset_tokens"
      | "identity_role_assignments"
      | "identity_workspace_assignments"
      | "identity_audit_events"
      | "identity_status_history"
      | "identity_lockouts",
  ): RepositoryAdapter<{ id: string; status: string }> =>
    usePostgres
      ? new PostgresRepository(
          table,
          pgDriver,
          new PgJsonMapper<{ id: string; status: string }>(),
          tenant,
          builder,
          rows,
          policy,
          tracer,
        )
      : new MappedRepository(
          table,
          tables,
          new JsonEntityMapper<{ id: string; status: string }>(),
          tenant,
          tracer,
          policy,
          cache,
        );

  return {
    clients,
    leads,
    projects,
    tickets,
    documents,
    users,
    artifacts,
    sessions,
    audit,
    notifications,
    contacts: bindCrm<CrmContact>("contacts"),
    opportunities: bindCrm<CrmOpportunity>("opportunities"),
    activities: bindCrm<CrmActivity>("activities"),
    tasks: bindCrm<CrmTask>("tasks"),
    notes: bindCrm<CrmNote>("notes"),
    quotes: bindCrm<CrmQuote>("quotes"),
    offers: bindCrm<Offer>("offers"),
    offerLines: bindCrm<OfferLine>("offer_lines"),
    offerDrafts: bindCrm<OfferDraft>("offer_drafts"),
    offerRevisions: bindCrm<OfferRevision>("offer_revisions"),
    offerApprovals: bindCrm<OfferApproval>("offer_approvals"),
    offerTemplates: bindCrm<OfferTemplate>("offer_templates"),
    offerAttachments: bindCrm<OfferAttachment>("offer_attachments"),
    offerStatusHistory: bindCrm<OfferStatusHistory>("offer_status_history"),
    invites: bindJson("invites"),
    inviteTokens: bindJson("invite_tokens"),
    inviteAcceptances: bindJson("invite_acceptances"),
    roleAssignments: bindJson("role_assignments"),
    workspaceAssignments: bindJson("workspace_assignments"),
    userStatusHistory: bindJson("user_status_history"),
    adminActions: bindJson("admin_actions"),
    userAudit: bindJson("user_audit_events"),
    notificationDeliveries: bindJson("notification_deliveries"),
    notificationTemplates: bindJson("notification_templates"),
    notificationRetries: bindJson("notification_retries"),
    rateLimitBuckets: bindJson("rate_limit_buckets"),
    inviteAttempts: bindJson("invite_attempts"),
    inviteSecurity: bindJson("invite_security"),
    abuseFlags: bindJson("abuse_flags"),
    rateLimitMaintenance: bindJson("rate_limit_maintenance"),
    proxyAnomalies: bindJson("proxy_anomalies"),
    rateLimitStoreHealth: bindJson("rate_limit_store_health"),
    identityUsers: bindJson("identity_users"),
    identitySessions: bindJson("identity_sessions"),
    identityCredentials: bindJson("identity_credentials"),
    identityRefreshTokens: bindJson("identity_refresh_tokens"),
    identityPasswordResetTokens: bindJson("identity_password_reset_tokens"),
    identityRoleAssignments: bindJson("identity_role_assignments"),
    identityWorkspaceAssignments: bindJson("identity_workspace_assignments"),
    identityAuditEvents: bindJson("identity_audit_events"),
    identityStatusHistory: bindJson("identity_status_history"),
    identityLockouts: bindJson("identity_lockouts"),
  };
}

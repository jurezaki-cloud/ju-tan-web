import type { SeedContext, TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { store } from "@/src/repositories/mock/store";
import {
  ClientMapper,
  DocumentMapper,
  LeadMapper,
  ProjectMapper,
  TicketMapper,
  UserMapper,
  baseRecord,
} from "../mapping";
import { defaultTenant } from "../entities";
import { mockIdentityUsers } from "@/src/identity/users/mockUsers";
import { identityDemoEnabled } from "@/src/identity/config";
import { hashIdentitySecret } from "@/src/identity/sync/hash";
import { stampEntity, toIdentityUserRecord } from "@/src/identity/sync/map";

export class SeedRunner {
  constructor(
    private readonly tables: InMemoryTables,
    private readonly scope: TenantScope = defaultTenant,
  ) {}

  run(context: SeedContext = { tenant: this.scope, now: () => new Date() }): void {
    const scope = context.tenant;
    const now = context.now().toISOString();
    if (this.tables.list("organizations", scope).length === 0) {
      this.tables.insert(
        "organizations",
        baseRecord("org-ju-tan", "active", { name: "JU-TAN" }, scope, { createdAt: now }),
        scope,
      );
      this.tables.insert(
        "workspaces",
        baseRecord("ws-demo", "active", { name: "Demo workspace" }, scope, { createdAt: now }),
        scope,
      );
    }
    if (this.tables.list("clients", scope).length === 0) {
      const clients = new ClientMapper();
      store.clients.forEach((item) => this.tables.insert("clients", clients.toRecord(item, scope), scope));
      store.leads.forEach((item) => this.tables.insert("leads", new LeadMapper().toRecord(item, scope), scope));
      store.projects.forEach((item) => this.tables.insert("projects", new ProjectMapper().toRecord(item, scope), scope));
      store.tickets.forEach((item) => this.tables.insert("tickets", new TicketMapper().toRecord(item, scope), scope));
      store.documents.forEach((item) => this.tables.insert("documents", new DocumentMapper().toRecord(item, scope), scope));
      store.users.forEach((item) => this.tables.insert("users", new UserMapper().toRecord(item, scope), scope));
      store.conversations.forEach((item) =>
        this.tables.insert("conversations", baseRecord(item.id, item.resolved ? "resolved" : "open", { ...item }, scope), scope),
      );
      store.automations.forEach((item) =>
        this.tables.insert("automations", baseRecord(item.id, item.status, { ...item }, scope), scope),
      );
      store.activity.forEach((item) =>
        this.tables.insert("activities", baseRecord(item.id, "open", { ...item }, scope), scope),
      );
      store.tasks.forEach((item) => this.tables.insert("tasks", baseRecord(item.id, "open", { ...item }, scope), scope));
      store.catalogDocuments.forEach((item) =>
        this.tables.insert("document_versions", baseRecord(`ver-${item.id}`, item.status, { documentId: item.id, version: 1 }, scope), scope),
      );
      store.catalogArtifactLinks.forEach((item, index) =>
        this.tables.insert(
          "artifact_links",
          baseRecord(`alink-${index + 1}`, "active", { ...item }, scope),
          scope,
        ),
      );
      store.catalogDocuments.slice(0, 4).forEach((item) =>
        this.tables.insert(
          "artifacts",
          baseRecord(`art-${item.id}`, "active", { title: item.name, format: item.format, uri: `mock://documents/${item.id}` }, scope),
          scope,
        ),
      );
      this.tables.insert(
        "knowledge_collections",
        baseRecord("kc-docs", "active", { name: "docs", description: "Dokumenti in pogodbe" }, scope),
        scope,
      );
      this.tables.insert(
        "notification_events",
        baseRecord("ntf-seed", "prepared", { title: "Demo obvestilo", channel: "in-app" }, scope),
        scope,
      );
      this.tables.insert(
        "audit_events",
        baseRecord("aud-seed", "event", { type: "SeedApplied", at: now }, scope),
        scope,
      );
      this.tables.insert(
        "sessions",
        baseRecord("ses-demo", "active", { userId: "u-01", token: "demo", device: "seed" }, scope, { ownerId: "u-01" }),
        scope,
      );
    }
    this.seedCrmCatalog(scope);
  }

  private seedCrmCatalog(scope: TenantScope) {
    const insertAll = (table: Parameters<InMemoryTables["insert"]>[0], rows: Array<{ id: string; status: string; createdAt?: string }>) => {
      for (const row of rows) {
        if (this.tables.get(table, row.id, scope)) continue;
        this.tables.insert(table, baseRecord(row.id, row.status, { ...row }, scope, { createdAt: row.createdAt }), scope);
      }
    };
    if (this.tables.list("contacts", scope).length === 0) {
      insertAll(
        "contacts",
        store.crmContacts.map((item) => {
          const parts = (item.name ?? "").split(" ");
          return {
            ...item,
            firstName: parts[0] ?? "Kontakt",
            lastName: parts.slice(1).join(" ") || "Demo",
          };
        }),
      );
    }
    if (this.tables.list("opportunities", scope).length === 0)       insertAll("opportunities", store.crmOpportunities);
    if (this.tables.list("notes", scope).length === 0)
      insertAll("notes", store.crmNotes.map((item) => ({ ...item, body: item.body ?? item.name })));
    if (this.tables.list("quotes", scope).length === 0) insertAll("quotes", store.crmQuotes);
    for (const row of store.crmActivities) {
      if (this.tables.get("activities", row.id, scope)) continue;
      this.tables.insert("activities", baseRecord(row.id, row.status, { ...row, type: row.kind ?? "call", subject: row.name }, scope, { createdAt: row.createdAt }), scope);
    }
    for (const row of store.crmTasks) {
      if (this.tables.get("tasks", row.id, scope)) continue;
      this.tables.insert("tasks", baseRecord(row.id, row.status, { ...row, dueAt: row.due }, scope, { createdAt: row.createdAt }), scope);
    }
    if (this.tables.list("offer_templates", scope).length === 0) {
      insertAll("offer_templates", [
        {
          id: "ot-01",
          status: "active",
          name: "Standardna ponudba",
          title: "Implementacija",
          currency: "EUR",
          defaultTaxRate: 22,
          notes: "DDV 22 %",
        },
      ] as unknown as Array<{ id: string; status: string }>);
    }
    if (this.tables.list("offers", scope).length === 0) {
      insertAll("offers", [
        {
          id: "of-01",
          status: "Draft",
          number: "P-0001",
          title: "CRM pipeline",
          clientId: "cl-02",
          leadId: "c-02",
          projectId: "p-02",
          currency: "EUR",
          subtotal: 6000,
          tax: 1320,
          total: 7320,
          validUntil: "2026-10-15",
        },
      ] as unknown as Array<{ id: string; status: string }>);
      insertAll("offer_drafts", [
        {
          id: "of-01-draft",
          status: "Draft",
          offerId: "of-01",
          source: "lead",
          aiSummary: "Osnutek CRM pipeline za Stranko 02. Predpostavke: obseg po dogovoru.",
          assumptions: "Obseg dela je usklajen s stranko.",
          risks: "Zamuda pri podpisu lahko premakne rok.",
        },
      ] as unknown as Array<{ id: string; status: string }>);
      insertAll("offer_lines", [
        {
          id: "of-01-l1",
          status: "active",
          offerId: "of-01",
          label: "Analiza in načrt",
          quantity: 1,
          unitPrice: 1200,
          taxRate: 22,
          total: 1464,
          sortOrder: 1,
        },
        {
          id: "of-01-l2",
          status: "active",
          offerId: "of-01",
          label: "Implementacija",
          quantity: 1,
          unitPrice: 4800,
          taxRate: 22,
          total: 5856,
          sortOrder: 2,
        },
      ] as unknown as Array<{ id: string; status: string }>);
      insertAll("offer_status_history", [
        {
          id: "of-01-h0",
          status: "Draft",
          offerId: "of-01",
          toStatus: "Draft",
          note: "Seed osnutek",
        },
      ] as unknown as Array<{ id: string; status: string }>);
    }
    this.seedIdentityStore(scope);
  }

  private seedIdentityStore(scope: TenantScope) {
    if (!identityDemoEnabled()) return;
    if (this.tables.list("identity_users", scope).length > 0) return;
    for (const user of mockIdentityUsers) {
      const record = toIdentityUserRecord(user);
      this.tables.insert("identity_users", baseRecord(record.id, record.status, { ...record }, scope, { ownerId: user.id, createdAt: record.createdAt }), scope);
      this.tables.insert(
        "identity_credentials",
        baseRecord(`crd-${user.id}`, "active", {
          ...stampEntity(`crd-${user.id}`, "active", user.id),
          userId: user.id,
          passwordHash: user.passwordHash,
          passwordVersion: 1,
          passwordChangedAt: record.createdAt,
          passwordPolicyVersion: "demo",
        }, scope, { ownerId: user.id }),
        scope,
      );
      this.tables.insert(
        "identity_role_assignments",
        baseRecord(`irole-${user.id}`, "active", {
          ...stampEntity(`irole-${user.id}`, "active", "system"),
          userId: user.id,
          role: user.role,
          scope: "tenant",
          assignedBy: "system",
        }, scope, { ownerId: "system" }),
        scope,
      );
      this.tables.insert(
        "identity_workspace_assignments",
        baseRecord(`iws-${user.id}`, "active", {
          ...stampEntity(`iws-${user.id}`, "active", "system", { workspaceId: user.workspaceId ?? "ws-demo" }),
          userId: user.id,
          permissions: ["workspace.access"],
        }, scope, { ownerId: "system", workspaceId: user.workspaceId ?? "ws-demo" }),
        scope,
      );
      const sid = `ses-demo-${user.id}`;
      const refreshHash = hashIdentitySecret(`demo-refresh-${user.id}`);
      this.tables.insert(
        "identity_sessions",
        baseRecord(sid, "active", {
          ...stampEntity(sid, "active", user.id),
          userId: user.id,
          accessTokenHash: hashIdentitySecret(`demo-access-${user.id}`),
          refreshTokenHash: refreshHash,
          expiresAt: new Date(Date.now() + 8 * 60 * 60_000).toISOString(),
          ipAddress: "127.0.0.1",
          userAgent: "seed",
          rememberMe: false,
        }, scope, { ownerId: user.id }),
        scope,
      );
      this.tables.insert(
        "identity_refresh_tokens",
        baseRecord(`rft-demo-${user.id}`, "active", {
          ...stampEntity(`rft-demo-${user.id}`, "active", user.id),
          userId: user.id,
          sessionId: sid,
          tokenHash: refreshHash,
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60_000).toISOString(),
        }, scope, { ownerId: user.id }),
        scope,
      );
    }
  }
}

export function syncPlatformStore(tables: InMemoryTables, scope: TenantScope = defaultTenant): void {
  store.clients = tables.list("clients", scope).map((row) => new ClientMapper().toDomain(row));
  store.leads = tables.list("leads", scope).map((row) => new LeadMapper().toDomain(row));
  store.projects = tables.list("projects", scope).map((row) => new ProjectMapper().toDomain(row));
  store.tickets = tables.list("tickets", scope).map((row) => new TicketMapper().toDomain(row));
  store.documents = tables.list("documents", scope).map((row) => new DocumentMapper().toDomain(row));
  store.users = tables.list("users", scope).map((row) => new UserMapper().toDomain(row));
}

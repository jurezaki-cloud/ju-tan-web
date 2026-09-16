import type { TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { baseRecord } from "../mapping";
import { SEED_FEATURE_FLAGS, SEED_IDS } from "./seed-data";
import { SeedRegistry } from "./seed-registry";
import type { PersistenceTable } from "../entities";

function ensure(
  tables: InMemoryTables,
  table: PersistenceTable,
  id: string,
  status: string,
  data: Record<string, unknown>,
  scope: TenantScope,
) {
  if (!tables.get(table, id, scope)) {
    tables.insert(table, baseRecord(id, status, { id, ...data }, scope), scope);
  }
}

function presentOrSeed(
  tables: InMemoryTables,
  table: PersistenceTable,
  id: string,
  status: string,
  data: Record<string, unknown>,
  scope: TenantScope,
) {
  if (tables.list(table, scope).length > 0) return;
  ensure(tables, table, id, status, data, scope);
}

export function applySeedSteps(tables: InMemoryTables, scope: TenantScope, registry: SeedRegistry): void {
  presentOrSeed(tables, "organizations", SEED_IDS.organization, "active", { name: "JU-TAN" }, scope);
  registry.mark("organization");

  presentOrSeed(tables, "workspaces", SEED_IDS.workspace, "active", { name: "Demo workspace" }, scope);
  registry.mark("workspace");

  presentOrSeed(
    tables,
    "users",
    SEED_IDS.adminUser,
    "active",
    { id: SEED_IDS.adminUser, name: "Admin", email: "admin@ju-tan.local", role: "ADMIN" },
    scope,
  );
  registry.mark("admin-user");

  presentOrSeed(
    tables,
    "clients",
    SEED_IDS.client,
    "Aktiven",
    {
      name: "Demo Client",
      industry: "Demo",
      status: "Aktiven",
      city: "Ljubljana",
      contactName: "Demo",
      email: "client@demo.local",
      phone: "",
      notes: [],
    },
    scope,
  );
  registry.mark("demo-client");

  presentOrSeed(
    tables,
    "leads",
    SEED_IDS.lead,
    "Novo",
    {
      name: "Demo Lead",
      company: "Demo Client",
      companyId: SEED_IDS.client,
      status: "Novo",
      phone: "",
      email: "lead@demo.local",
      lastContact: new Date().toISOString().slice(0, 10),
    },
    scope,
  );
  registry.mark("demo-lead");

  presentOrSeed(
    tables,
    "projects",
    SEED_IDS.project,
    "V teku",
    {
      name: "Demo Project",
      clientId: SEED_IDS.client,
      clientName: "Demo Client",
      status: "V teku",
      progress: 10,
      owner: "Admin",
      due: "2026-12-31",
      priority: "Srednja",
    },
    scope,
  );
  registry.mark("demo-project");

  presentOrSeed(
    tables,
    "documents",
    SEED_IDS.document,
    "active",
    {
      name: "Demo Document",
      folder: "PDF",
      clientId: SEED_IDS.client,
      clientName: "Demo Client",
      updated: new Date().toISOString().slice(0, 10),
      kind: "PDF",
    },
    scope,
  );
  registry.mark("demo-document");

  presentOrSeed(
    tables,
    "artifacts",
    SEED_IDS.artifact,
    "active",
    { title: "Demo Artifact", uri: "mock://artifacts/demo" },
    scope,
  );
  registry.mark("demo-artifact");

  presentOrSeed(tables, "conversations", SEED_IDS.conversation, "open", { title: "Demo conversation" }, scope);
  registry.mark("demo-conversation");

  presentOrSeed(tables, "audit_events", SEED_IDS.audit, "event", { type: "SeedApplied" }, scope);
  registry.mark("demo-audit");

  presentOrSeed(
    tables,
    "sessions",
    SEED_IDS.session,
    "active",
    { userId: SEED_IDS.adminUser, token: "demo", device: "seed" },
    scope,
  );
  registry.mark("demo-session");

  for (const flag of SEED_FEATURE_FLAGS) {
    ensure(tables, "feature_flags", flag.id, flag.enabled ? "enabled" : "disabled", { key: flag.key, enabled: flag.enabled }, scope);
  }
  registry.mark("demo-feature-flags");
}

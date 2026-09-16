import { INIT_DOWN_SQL, INIT_SQL, OFFER_FLOW_DOWN_SQL, OFFER_FLOW_SQL, tableSql } from "./utils";
import { INDEXES_DOWN_SQL, INDEXES_SQL, SEED_BASICS_DOWN_SQL, SEED_BASICS_SQL } from "./sql";
import type { MigrationStep } from "@/src/types/postgres";

const RATE_LIMIT_OPS_TABLES = ["rate_limit_maintenance", "proxy_anomalies", "rate_limit_store_health"] as const;
const IDENTITY_STORE_TABLES = [
  "identity_users",
  "identity_sessions",
  "identity_credentials",
  "identity_refresh_tokens",
  "identity_password_reset_tokens",
  "identity_role_assignments",
  "identity_workspace_assignments",
  "identity_audit_events",
  "identity_status_history",
  "identity_lockouts",
] as const;
const IDENTITY_STORE_SQL = IDENTITY_STORE_TABLES.map(tableSql).join("\n\n");
const IDENTITY_STORE_DOWN_SQL = [...IDENTITY_STORE_TABLES]
  .reverse()
  .map((name) => `DROP TABLE IF EXISTS ${name};`)
  .join("\n");
const RATE_LIMIT_OPS_SQL = RATE_LIMIT_OPS_TABLES.map(tableSql).join("\n\n");
const RATE_LIMIT_OPS_DOWN_SQL = [...RATE_LIMIT_OPS_TABLES]
  .reverse()
  .map((name) => `DROP TABLE IF EXISTS ${name};`)
  .join("\n");

export const INIT_MIGRATION: MigrationStep = {
  id: "001",
  name: "init",
  sql: INIT_SQL,
  downSql: INIT_DOWN_SQL,
};

export const INDEXES_MIGRATION: MigrationStep = {
  id: "002",
  name: "indexes",
  sql: INDEXES_SQL,
  downSql: INDEXES_DOWN_SQL,
};

export const SEED_BASICS_MIGRATION: MigrationStep = {
  id: "003",
  name: "seed_basics",
  sql: SEED_BASICS_SQL,
  downSql: SEED_BASICS_DOWN_SQL,
};

export const OFFER_FLOW_MIGRATION: MigrationStep = {
  id: "004",
  name: "offer_flow",
  sql: OFFER_FLOW_SQL,
  downSql: OFFER_FLOW_DOWN_SQL,
};

export const RATE_LIMIT_OPS_MIGRATION: MigrationStep = {
  id: "005",
  name: "rate_limit_ops",
  sql: RATE_LIMIT_OPS_SQL,
  downSql: RATE_LIMIT_OPS_DOWN_SQL,
};

export const IDENTITY_STORE_MIGRATION: MigrationStep = {
  id: "006",
  name: "identity_store",
  sql: IDENTITY_STORE_SQL,
  downSql: IDENTITY_STORE_DOWN_SQL,
};

export const MIGRATION_REGISTRY: MigrationStep[] = [
  INIT_MIGRATION,
  INDEXES_MIGRATION,
  SEED_BASICS_MIGRATION,
  OFFER_FLOW_MIGRATION,
  RATE_LIMIT_OPS_MIGRATION,
  IDENTITY_STORE_MIGRATION,
];

export function listMigrations(): MigrationStep[] {
  return [...MIGRATION_REGISTRY];
}

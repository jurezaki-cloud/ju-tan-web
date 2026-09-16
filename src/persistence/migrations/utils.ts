import { PERSISTENCE_TABLES } from "../entities";

const CORE = `
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  tenant_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  owner_id TEXT,
  deleted_at TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  external_id TEXT,
  email TEXT,
  name TEXT,
  client_id TEXT,
  project_id TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
`;

export function tableSql(name: string): string {
  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_${name}_tenant_id ON ${name} (tenant_id);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_workspace_id ON ${name} (workspace_id);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_organization_id ON ${name} (organization_id);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_owner_id ON ${name} (owner_id);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_created_at ON ${name} (created_at);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_status ON ${name} (status);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_deleted_at ON ${name} (deleted_at);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_external_id ON ${name} (external_id);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_email ON ${name} (email);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_name ON ${name} (name);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_project_id ON ${name} (project_id);`,
    `CREATE INDEX IF NOT EXISTS idx_${name}_client_id ON ${name} (client_id);`,
  ];
  return `CREATE TABLE IF NOT EXISTS ${name} (\n${CORE}\n);\n${indexes.join("\n")}`;
}

export const INIT_SQL = [
  `CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
  ...PERSISTENCE_TABLES.map(tableSql),
].join("\n\n");

export const INIT_DOWN_SQL = [
  ...[...PERSISTENCE_TABLES].reverse().map((name) => `DROP TABLE IF EXISTS ${name};`),
  "DROP TABLE IF EXISTS schema_migrations;",
].join("\n");

const OFFER_FLOW_TABLES = [
  "offers",
  "offer_lines",
  "offer_drafts",
  "offer_revisions",
  "offer_approvals",
  "offer_templates",
  "offer_attachments",
  "offer_status_history",
] as const;

export const OFFER_FLOW_SQL = OFFER_FLOW_TABLES.map(tableSql).join("\n\n");
export const OFFER_FLOW_DOWN_SQL = [...OFFER_FLOW_TABLES]
  .reverse()
  .map((name) => `DROP TABLE IF EXISTS ${name};`)
  .join("\n");

export const ALLOWED_TABLES = new Set<string>([...PERSISTENCE_TABLES, "schema_migrations"]);

export function assertSafeIdent(value: string): string {
  if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
    throw new Error(`Neveljavno SQL ime: ${value}`);
  }
  return value;
}

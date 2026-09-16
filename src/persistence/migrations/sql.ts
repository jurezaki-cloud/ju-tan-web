export const INDEXES_SQL = `
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations (applied_at);

CREATE INDEX IF NOT EXISTS idx_organizations_tenant_org_deleted ON organizations (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_workspaces_tenant_org_deleted ON workspaces (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_tenant_org_deleted ON users (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_sessions_tenant_org_deleted ON sessions (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_clients_tenant_org_deleted ON clients (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_org_deleted ON leads (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_tenant_org_deleted ON projects (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_documents_tenant_org_deleted ON documents (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_artifacts_tenant_org_deleted ON artifacts (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant_org_deleted ON conversations (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_audit_events_tenant_org_deleted ON audit_events (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_feature_flags_tenant_org_deleted ON feature_flags (tenant_id, organization_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_clients_tenant_org_version ON clients (tenant_id, organization_id, version);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_org_version ON leads (tenant_id, organization_id, version);
CREATE INDEX IF NOT EXISTS idx_projects_tenant_org_version ON projects (tenant_id, organization_id, version);
`;

export const INDEXES_DOWN_SQL = `
DROP INDEX IF EXISTS idx_projects_tenant_org_version;
DROP INDEX IF EXISTS idx_leads_tenant_org_version;
DROP INDEX IF EXISTS idx_clients_tenant_org_version;
DROP INDEX IF EXISTS idx_feature_flags_tenant_org_deleted;
DROP INDEX IF EXISTS idx_audit_events_tenant_org_deleted;
DROP INDEX IF EXISTS idx_conversations_tenant_org_deleted;
DROP INDEX IF EXISTS idx_artifacts_tenant_org_deleted;
DROP INDEX IF EXISTS idx_documents_tenant_org_deleted;
DROP INDEX IF EXISTS idx_projects_tenant_org_deleted;
DROP INDEX IF EXISTS idx_leads_tenant_org_deleted;
DROP INDEX IF EXISTS idx_clients_tenant_org_deleted;
DROP INDEX IF EXISTS idx_sessions_tenant_org_deleted;
DROP INDEX IF EXISTS idx_users_tenant_org_deleted;
DROP INDEX IF EXISTS idx_workspaces_tenant_org_deleted;
DROP INDEX IF EXISTS idx_organizations_tenant_org_deleted;
DROP INDEX IF EXISTS idx_schema_migrations_applied_at;
`;

export const SEED_BASICS_SQL = `
CREATE TABLE IF NOT EXISTS schema_seeds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schema_seeds_applied_at ON schema_seeds (applied_at);
`;

export const SEED_BASICS_DOWN_SQL = `
DROP INDEX IF EXISTS idx_schema_seeds_applied_at;
DROP TABLE IF EXISTS schema_seeds;
`;

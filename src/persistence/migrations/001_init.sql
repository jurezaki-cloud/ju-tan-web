-- JU-TAN persistence schema v1.0

CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizations (
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
);
CREATE INDEX IF NOT EXISTS idx_organizations_tenant_id ON organizations (tenant_id);
CREATE INDEX IF NOT EXISTS idx_organizations_workspace_id ON organizations (workspace_id);
CREATE INDEX IF NOT EXISTS idx_organizations_organization_id ON organizations (organization_id);
CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations (owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_created_at ON organizations (created_at);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations (status);
CREATE INDEX IF NOT EXISTS idx_organizations_deleted_at ON organizations (deleted_at);
CREATE INDEX IF NOT EXISTS idx_organizations_external_id ON organizations (external_id);
CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations (email);
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations (name);
CREATE INDEX IF NOT EXISTS idx_organizations_project_id ON organizations (project_id);
CREATE INDEX IF NOT EXISTS idx_organizations_client_id ON organizations (client_id);

CREATE TABLE IF NOT EXISTS workspaces (
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
);
CREATE INDEX IF NOT EXISTS idx_workspaces_tenant_id ON workspaces (tenant_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_workspace_id ON workspaces (workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_organization_id ON workspaces (organization_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces (owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_created_at ON workspaces (created_at);
CREATE INDEX IF NOT EXISTS idx_workspaces_status ON workspaces (status);
CREATE INDEX IF NOT EXISTS idx_workspaces_deleted_at ON workspaces (deleted_at);
CREATE INDEX IF NOT EXISTS idx_workspaces_external_id ON workspaces (external_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_email ON workspaces (email);
CREATE INDEX IF NOT EXISTS idx_workspaces_name ON workspaces (name);
CREATE INDEX IF NOT EXISTS idx_workspaces_project_id ON workspaces (project_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_client_id ON workspaces (client_id);

CREATE TABLE IF NOT EXISTS users (
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
);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users (tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_workspace_id ON users (workspace_id);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users (organization_id);
CREATE INDEX IF NOT EXISTS idx_users_owner_id ON users (owner_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);
CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users (deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_external_id ON users (external_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_name ON users (name);
CREATE INDEX IF NOT EXISTS idx_users_project_id ON users (project_id);
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users (client_id);

CREATE TABLE IF NOT EXISTS sessions (
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
);
CREATE INDEX IF NOT EXISTS idx_sessions_tenant_id ON sessions (tenant_id);
CREATE INDEX IF NOT EXISTS idx_sessions_workspace_id ON sessions (workspace_id);
CREATE INDEX IF NOT EXISTS idx_sessions_organization_id ON sessions (organization_id);
CREATE INDEX IF NOT EXISTS idx_sessions_owner_id ON sessions (owner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions (created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions (status);
CREATE INDEX IF NOT EXISTS idx_sessions_deleted_at ON sessions (deleted_at);
CREATE INDEX IF NOT EXISTS idx_sessions_external_id ON sessions (external_id);
CREATE INDEX IF NOT EXISTS idx_sessions_email ON sessions (email);
CREATE INDEX IF NOT EXISTS idx_sessions_name ON sessions (name);
CREATE INDEX IF NOT EXISTS idx_sessions_project_id ON sessions (project_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_id ON sessions (client_id);

CREATE TABLE IF NOT EXISTS clients (
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
);
CREATE INDEX IF NOT EXISTS idx_clients_tenant_id ON clients (tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_workspace_id ON clients (workspace_id);
CREATE INDEX IF NOT EXISTS idx_clients_organization_id ON clients (organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_owner_id ON clients (owner_id);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients (created_at);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients (status);
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients (deleted_at);
CREATE INDEX IF NOT EXISTS idx_clients_external_id ON clients (external_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients (name);
CREATE INDEX IF NOT EXISTS idx_clients_project_id ON clients (project_id);
CREATE INDEX IF NOT EXISTS idx_clients_client_id ON clients (client_id);

CREATE TABLE IF NOT EXISTS leads (
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
);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads (tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_workspace_id ON leads (workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_organization_id ON leads (organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads (owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON leads (deleted_at);
CREATE INDEX IF NOT EXISTS idx_leads_external_id ON leads (external_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_name ON leads (name);
CREATE INDEX IF NOT EXISTS idx_leads_project_id ON leads (project_id);
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON leads (client_id);

CREATE TABLE IF NOT EXISTS contacts (
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
);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_id ON contacts (tenant_id);
CREATE INDEX IF NOT EXISTS idx_contacts_workspace_id ON contacts (workspace_id);
CREATE INDEX IF NOT EXISTS idx_contacts_organization_id ON contacts (organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_owner_id ON contacts (owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts (status);
CREATE INDEX IF NOT EXISTS idx_contacts_deleted_at ON contacts (deleted_at);
CREATE INDEX IF NOT EXISTS idx_contacts_external_id ON contacts (external_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts (name);
CREATE INDEX IF NOT EXISTS idx_contacts_project_id ON contacts (project_id);
CREATE INDEX IF NOT EXISTS idx_contacts_client_id ON contacts (client_id);

CREATE TABLE IF NOT EXISTS opportunities (
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
);
CREATE INDEX IF NOT EXISTS idx_opportunities_tenant_id ON opportunities (tenant_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_workspace_id ON opportunities (workspace_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_organization_id ON opportunities (organization_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_owner_id ON opportunities (owner_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities (created_at);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_deleted_at ON opportunities (deleted_at);
CREATE INDEX IF NOT EXISTS idx_opportunities_external_id ON opportunities (external_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_email ON opportunities (email);
CREATE INDEX IF NOT EXISTS idx_opportunities_name ON opportunities (name);
CREATE INDEX IF NOT EXISTS idx_opportunities_project_id ON opportunities (project_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_client_id ON opportunities (client_id);

CREATE TABLE IF NOT EXISTS activities (
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
);
CREATE INDEX IF NOT EXISTS idx_activities_tenant_id ON activities (tenant_id);
CREATE INDEX IF NOT EXISTS idx_activities_workspace_id ON activities (workspace_id);
CREATE INDEX IF NOT EXISTS idx_activities_organization_id ON activities (organization_id);
CREATE INDEX IF NOT EXISTS idx_activities_owner_id ON activities (owner_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities (created_at);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities (status);
CREATE INDEX IF NOT EXISTS idx_activities_deleted_at ON activities (deleted_at);
CREATE INDEX IF NOT EXISTS idx_activities_external_id ON activities (external_id);
CREATE INDEX IF NOT EXISTS idx_activities_email ON activities (email);
CREATE INDEX IF NOT EXISTS idx_activities_name ON activities (name);
CREATE INDEX IF NOT EXISTS idx_activities_project_id ON activities (project_id);
CREATE INDEX IF NOT EXISTS idx_activities_client_id ON activities (client_id);

CREATE TABLE IF NOT EXISTS tasks (
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
);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id ON tasks (tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON tasks (workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_organization_id ON tasks (organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_owner_id ON tasks (owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks (deleted_at);
CREATE INDEX IF NOT EXISTS idx_tasks_external_id ON tasks (external_id);
CREATE INDEX IF NOT EXISTS idx_tasks_email ON tasks (email);
CREATE INDEX IF NOT EXISTS idx_tasks_name ON tasks (name);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks (client_id);

CREATE TABLE IF NOT EXISTS notes (
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
);
CREATE INDEX IF NOT EXISTS idx_notes_tenant_id ON notes (tenant_id);
CREATE INDEX IF NOT EXISTS idx_notes_workspace_id ON notes (workspace_id);
CREATE INDEX IF NOT EXISTS idx_notes_organization_id ON notes (organization_id);
CREATE INDEX IF NOT EXISTS idx_notes_owner_id ON notes (owner_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at);
CREATE INDEX IF NOT EXISTS idx_notes_status ON notes (status);
CREATE INDEX IF NOT EXISTS idx_notes_deleted_at ON notes (deleted_at);
CREATE INDEX IF NOT EXISTS idx_notes_external_id ON notes (external_id);
CREATE INDEX IF NOT EXISTS idx_notes_email ON notes (email);
CREATE INDEX IF NOT EXISTS idx_notes_name ON notes (name);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes (project_id);
CREATE INDEX IF NOT EXISTS idx_notes_client_id ON notes (client_id);

CREATE TABLE IF NOT EXISTS quotes (
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
);
CREATE INDEX IF NOT EXISTS idx_quotes_tenant_id ON quotes (tenant_id);
CREATE INDEX IF NOT EXISTS idx_quotes_workspace_id ON quotes (workspace_id);
CREATE INDEX IF NOT EXISTS idx_quotes_organization_id ON quotes (organization_id);
CREATE INDEX IF NOT EXISTS idx_quotes_owner_id ON quotes (owner_id);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes (created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes (status);
CREATE INDEX IF NOT EXISTS idx_quotes_deleted_at ON quotes (deleted_at);
CREATE INDEX IF NOT EXISTS idx_quotes_external_id ON quotes (external_id);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes (email);
CREATE INDEX IF NOT EXISTS idx_quotes_name ON quotes (name);
CREATE INDEX IF NOT EXISTS idx_quotes_project_id ON quotes (project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes (client_id);

CREATE TABLE IF NOT EXISTS projects (
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
);
CREATE INDEX IF NOT EXISTS idx_projects_tenant_id ON projects (tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON projects (workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_organization_id ON projects (organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects (owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects (deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_external_id ON projects (external_id);
CREATE INDEX IF NOT EXISTS idx_projects_email ON projects (email);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects (name);
CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects (project_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects (client_id);

CREATE TABLE IF NOT EXISTS documents (
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
);
CREATE INDEX IF NOT EXISTS idx_documents_tenant_id ON documents (tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_workspace_id ON documents (workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_organization_id ON documents (organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON documents (owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents (created_at);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_deleted_at ON documents (deleted_at);
CREATE INDEX IF NOT EXISTS idx_documents_external_id ON documents (external_id);
CREATE INDEX IF NOT EXISTS idx_documents_email ON documents (email);
CREATE INDEX IF NOT EXISTS idx_documents_name ON documents (name);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents (project_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents (client_id);

CREATE TABLE IF NOT EXISTS document_versions (
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
);
CREATE INDEX IF NOT EXISTS idx_document_versions_tenant_id ON document_versions (tenant_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_workspace_id ON document_versions (workspace_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_organization_id ON document_versions (organization_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_owner_id ON document_versions (owner_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_created_at ON document_versions (created_at);
CREATE INDEX IF NOT EXISTS idx_document_versions_status ON document_versions (status);
CREATE INDEX IF NOT EXISTS idx_document_versions_deleted_at ON document_versions (deleted_at);
CREATE INDEX IF NOT EXISTS idx_document_versions_external_id ON document_versions (external_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_email ON document_versions (email);
CREATE INDEX IF NOT EXISTS idx_document_versions_name ON document_versions (name);
CREATE INDEX IF NOT EXISTS idx_document_versions_project_id ON document_versions (project_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_client_id ON document_versions (client_id);

CREATE TABLE IF NOT EXISTS artifacts (
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
);
CREATE INDEX IF NOT EXISTS idx_artifacts_tenant_id ON artifacts (tenant_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_workspace_id ON artifacts (workspace_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_organization_id ON artifacts (organization_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_owner_id ON artifacts (owner_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON artifacts (created_at);
CREATE INDEX IF NOT EXISTS idx_artifacts_status ON artifacts (status);
CREATE INDEX IF NOT EXISTS idx_artifacts_deleted_at ON artifacts (deleted_at);
CREATE INDEX IF NOT EXISTS idx_artifacts_external_id ON artifacts (external_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_email ON artifacts (email);
CREATE INDEX IF NOT EXISTS idx_artifacts_name ON artifacts (name);
CREATE INDEX IF NOT EXISTS idx_artifacts_project_id ON artifacts (project_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_client_id ON artifacts (client_id);

CREATE TABLE IF NOT EXISTS artifact_links (
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
);
CREATE INDEX IF NOT EXISTS idx_artifact_links_tenant_id ON artifact_links (tenant_id);
CREATE INDEX IF NOT EXISTS idx_artifact_links_workspace_id ON artifact_links (workspace_id);
CREATE INDEX IF NOT EXISTS idx_artifact_links_organization_id ON artifact_links (organization_id);
CREATE INDEX IF NOT EXISTS idx_artifact_links_owner_id ON artifact_links (owner_id);
CREATE INDEX IF NOT EXISTS idx_artifact_links_created_at ON artifact_links (created_at);
CREATE INDEX IF NOT EXISTS idx_artifact_links_status ON artifact_links (status);
CREATE INDEX IF NOT EXISTS idx_artifact_links_deleted_at ON artifact_links (deleted_at);
CREATE INDEX IF NOT EXISTS idx_artifact_links_external_id ON artifact_links (external_id);
CREATE INDEX IF NOT EXISTS idx_artifact_links_email ON artifact_links (email);
CREATE INDEX IF NOT EXISTS idx_artifact_links_name ON artifact_links (name);
CREATE INDEX IF NOT EXISTS idx_artifact_links_project_id ON artifact_links (project_id);
CREATE INDEX IF NOT EXISTS idx_artifact_links_client_id ON artifact_links (client_id);

CREATE TABLE IF NOT EXISTS tickets (
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
);
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_id ON tickets (tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_workspace_id ON tickets (workspace_id);
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id ON tickets (organization_id);
CREATE INDEX IF NOT EXISTS idx_tickets_owner_id ON tickets (owner_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets (created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_deleted_at ON tickets (deleted_at);
CREATE INDEX IF NOT EXISTS idx_tickets_external_id ON tickets (external_id);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets (email);
CREATE INDEX IF NOT EXISTS idx_tickets_name ON tickets (name);
CREATE INDEX IF NOT EXISTS idx_tickets_project_id ON tickets (project_id);
CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON tickets (client_id);

CREATE TABLE IF NOT EXISTS automations (
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
);
CREATE INDEX IF NOT EXISTS idx_automations_tenant_id ON automations (tenant_id);
CREATE INDEX IF NOT EXISTS idx_automations_workspace_id ON automations (workspace_id);
CREATE INDEX IF NOT EXISTS idx_automations_organization_id ON automations (organization_id);
CREATE INDEX IF NOT EXISTS idx_automations_owner_id ON automations (owner_id);
CREATE INDEX IF NOT EXISTS idx_automations_created_at ON automations (created_at);
CREATE INDEX IF NOT EXISTS idx_automations_status ON automations (status);
CREATE INDEX IF NOT EXISTS idx_automations_deleted_at ON automations (deleted_at);
CREATE INDEX IF NOT EXISTS idx_automations_external_id ON automations (external_id);
CREATE INDEX IF NOT EXISTS idx_automations_email ON automations (email);
CREATE INDEX IF NOT EXISTS idx_automations_name ON automations (name);
CREATE INDEX IF NOT EXISTS idx_automations_project_id ON automations (project_id);
CREATE INDEX IF NOT EXISTS idx_automations_client_id ON automations (client_id);

CREATE TABLE IF NOT EXISTS conversations (
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
);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant_id ON conversations (tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_workspace_id ON conversations (workspace_id);
CREATE INDEX IF NOT EXISTS idx_conversations_organization_id ON conversations (organization_id);
CREATE INDEX IF NOT EXISTS idx_conversations_owner_id ON conversations (owner_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations (created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations (status);
CREATE INDEX IF NOT EXISTS idx_conversations_deleted_at ON conversations (deleted_at);
CREATE INDEX IF NOT EXISTS idx_conversations_external_id ON conversations (external_id);
CREATE INDEX IF NOT EXISTS idx_conversations_email ON conversations (email);
CREATE INDEX IF NOT EXISTS idx_conversations_name ON conversations (name);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON conversations (project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations (client_id);

CREATE TABLE IF NOT EXISTS audit_events (
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
);
CREATE INDEX IF NOT EXISTS idx_audit_events_tenant_id ON audit_events (tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_workspace_id ON audit_events (workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_organization_id ON audit_events (organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_owner_id ON audit_events (owner_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events (created_at);
CREATE INDEX IF NOT EXISTS idx_audit_events_status ON audit_events (status);
CREATE INDEX IF NOT EXISTS idx_audit_events_deleted_at ON audit_events (deleted_at);
CREATE INDEX IF NOT EXISTS idx_audit_events_external_id ON audit_events (external_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_email ON audit_events (email);
CREATE INDEX IF NOT EXISTS idx_audit_events_name ON audit_events (name);
CREATE INDEX IF NOT EXISTS idx_audit_events_project_id ON audit_events (project_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_client_id ON audit_events (client_id);

CREATE TABLE IF NOT EXISTS notification_events (
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
);
CREATE INDEX IF NOT EXISTS idx_notification_events_tenant_id ON notification_events (tenant_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_workspace_id ON notification_events (workspace_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_organization_id ON notification_events (organization_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_owner_id ON notification_events (owner_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_created_at ON notification_events (created_at);
CREATE INDEX IF NOT EXISTS idx_notification_events_status ON notification_events (status);
CREATE INDEX IF NOT EXISTS idx_notification_events_deleted_at ON notification_events (deleted_at);
CREATE INDEX IF NOT EXISTS idx_notification_events_external_id ON notification_events (external_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_email ON notification_events (email);
CREATE INDEX IF NOT EXISTS idx_notification_events_name ON notification_events (name);
CREATE INDEX IF NOT EXISTS idx_notification_events_project_id ON notification_events (project_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_client_id ON notification_events (client_id);

CREATE TABLE IF NOT EXISTS knowledge_collections (
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
);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_tenant_id ON knowledge_collections (tenant_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_workspace_id ON knowledge_collections (workspace_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_organization_id ON knowledge_collections (organization_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_owner_id ON knowledge_collections (owner_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_created_at ON knowledge_collections (created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_status ON knowledge_collections (status);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_deleted_at ON knowledge_collections (deleted_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_external_id ON knowledge_collections (external_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_email ON knowledge_collections (email);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_name ON knowledge_collections (name);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_project_id ON knowledge_collections (project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_collections_client_id ON knowledge_collections (client_id);

CREATE TABLE IF NOT EXISTS integrations (
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
);
CREATE INDEX IF NOT EXISTS idx_integrations_tenant_id ON integrations (tenant_id);
CREATE INDEX IF NOT EXISTS idx_integrations_workspace_id ON integrations (workspace_id);
CREATE INDEX IF NOT EXISTS idx_integrations_organization_id ON integrations (organization_id);
CREATE INDEX IF NOT EXISTS idx_integrations_owner_id ON integrations (owner_id);
CREATE INDEX IF NOT EXISTS idx_integrations_created_at ON integrations (created_at);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations (status);
CREATE INDEX IF NOT EXISTS idx_integrations_deleted_at ON integrations (deleted_at);
CREATE INDEX IF NOT EXISTS idx_integrations_external_id ON integrations (external_id);
CREATE INDEX IF NOT EXISTS idx_integrations_email ON integrations (email);
CREATE INDEX IF NOT EXISTS idx_integrations_name ON integrations (name);
CREATE INDEX IF NOT EXISTS idx_integrations_project_id ON integrations (project_id);
CREATE INDEX IF NOT EXISTS idx_integrations_client_id ON integrations (client_id);

CREATE TABLE IF NOT EXISTS feature_flags (
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
);
CREATE INDEX IF NOT EXISTS idx_feature_flags_tenant_id ON feature_flags (tenant_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_workspace_id ON feature_flags (workspace_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_organization_id ON feature_flags (organization_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_owner_id ON feature_flags (owner_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_created_at ON feature_flags (created_at);
CREATE INDEX IF NOT EXISTS idx_feature_flags_status ON feature_flags (status);
CREATE INDEX IF NOT EXISTS idx_feature_flags_deleted_at ON feature_flags (deleted_at);
CREATE INDEX IF NOT EXISTS idx_feature_flags_external_id ON feature_flags (external_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_email ON feature_flags (email);
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON feature_flags (name);
CREATE INDEX IF NOT EXISTS idx_feature_flags_project_id ON feature_flags (project_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_client_id ON feature_flags (client_id);

CREATE TABLE IF NOT EXISTS settings (
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
);
CREATE INDEX IF NOT EXISTS idx_settings_tenant_id ON settings (tenant_id);
CREATE INDEX IF NOT EXISTS idx_settings_workspace_id ON settings (workspace_id);
CREATE INDEX IF NOT EXISTS idx_settings_organization_id ON settings (organization_id);
CREATE INDEX IF NOT EXISTS idx_settings_owner_id ON settings (owner_id);
CREATE INDEX IF NOT EXISTS idx_settings_created_at ON settings (created_at);
CREATE INDEX IF NOT EXISTS idx_settings_status ON settings (status);
CREATE INDEX IF NOT EXISTS idx_settings_deleted_at ON settings (deleted_at);
CREATE INDEX IF NOT EXISTS idx_settings_external_id ON settings (external_id);
CREATE INDEX IF NOT EXISTS idx_settings_email ON settings (email);
CREATE INDEX IF NOT EXISTS idx_settings_name ON settings (name);
CREATE INDEX IF NOT EXISTS idx_settings_project_id ON settings (project_id);
CREATE INDEX IF NOT EXISTS idx_settings_client_id ON settings (client_id);

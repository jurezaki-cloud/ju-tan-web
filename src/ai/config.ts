import type { AiAgent, AiProviderId, AiWorkspaceId } from "./types";

export const aiProviders: { id: AiProviderId; label: string }[] = [
  { id: "openai", label: "OpenAI" },
  { id: "azure-openai", label: "Azure OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google-gemini", label: "Google Gemini" },
  { id: "local", label: "Lokalni model" },
];

export const aiAgents: AiAgent[] = [
  {
    id: "general",
    name: "JU-TAN AI",
    description: "Splošni poslovni pomočnik",
    workspace: "chat",
    providerId: "openai",
    model: "mock-enterprise",
    tools: ["workspace.context", "documents.list"],
    knowledgeCollections: ["docs", "api"],
  },
  {
    id: "sales",
    name: "Sales AI",
    description: "Ponudbe in prodajni tok",
    workspace: "sales",
    providerId: "anthropic",
    model: "mock-enterprise",
    tools: ["crm.leads", "offers.create"],
    knowledgeCollections: ["crm", "docs"],
  },
  {
    id: "crm",
    name: "CRM AI",
    description: "Stiki in pipeline",
    workspace: "crm",
    providerId: "azure-openai",
    model: "mock-enterprise",
    tools: ["crm.leads", "crm.update"],
    knowledgeCollections: ["crm"],
  },
  {
    id: "erp",
    name: "ERP AI",
    description: "Dokumenti, zaloga, procesi",
    workspace: "erp",
    providerId: "openai",
    model: "mock-enterprise",
    tools: ["erp.documents", "erp.stock"],
    knowledgeCollections: ["erp"],
  },
  {
    id: "project",
    name: "Project AI",
    description: "Obseg, roki, naloge",
    workspace: "project",
    providerId: "google-gemini",
    model: "mock-enterprise",
    tools: ["projects.list", "tickets.create"],
    knowledgeCollections: ["docs"],
  },
  {
    id: "automation",
    name: "Automation AI",
    description: "Tokovi in avtomatizacije",
    workspace: "automation",
    providerId: "local",
    model: "mock-enterprise",
    tools: ["mcp.workflows", "automations.run"],
    knowledgeCollections: ["integrations"],
  },
  {
    id: "developer",
    name: "Developer AI",
    description: "API, koda, specifikacije",
    workspace: "developer",
    providerId: "openai",
    model: "mock-enterprise",
    tools: ["mcp.repo", "api.spec"],
    knowledgeCollections: ["api", "docs"],
  },
];

export const workspaceNav: {
  id: AiWorkspaceId;
  label: string;
}[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "chat", label: "AI Chat" },
  { id: "sales", label: "Sales AI" },
  { id: "crm", label: "CRM AI" },
  { id: "erp", label: "ERP AI" },
  { id: "project", label: "Project AI" },
  { id: "automation", label: "Automation AI" },
  { id: "developer", label: "Developer AI" },
  { id: "knowledge", label: "Knowledge Base" },
];

export function agentForWorkspace(workspace: AiWorkspaceId): AiAgent {
  return (
    aiAgents.find((agent) => agent.workspace === workspace) ?? aiAgents[0]
  );
}

export function isWorkspaceId(value: string | undefined): value is AiWorkspaceId {
  return workspaceNav.some((item) => item.id === value);
}

import type { SkillId } from "../types";

export type AgentSkill = {
  id: SkillId;
  name: string;
  description: string;
  requiredTools: string[];
  requiredPermissions: string[];
  estimatedDuration: string;
  delegate?: import("../types").DelegateAgentId;
};

export const agentSkills: AgentSkill[] = [
  {
    id: "create-offer",
    name: "Create Offer",
    description: "Ponudba, PDF in e-pošta.",
    requiredTools: ["crm.findClient", "offer.generate", "email.send"],
    requiredPermissions: ["ai", "crm"],
    estimatedDuration: "18 min",
    delegate: "sales",
  },
  {
    id: "website-audit",
    name: "Website Audit",
    description: "Pregled spletnega mesta (mock).",
    requiredTools: ["knowledge.search"],
    requiredPermissions: ["ai"],
    estimatedDuration: "12 min",
    delegate: "knowledge",
  },
  {
    id: "crm-analysis",
    name: "CRM Analysis",
    description: "Pregled stikov in pipelinea.",
    requiredTools: ["crm.findClient", "knowledge.search"],
    requiredPermissions: ["ai", "crm"],
    estimatedDuration: "8 min",
    delegate: "crm",
  },
  {
    id: "repository-review",
    name: "Repository Review",
    description: "Pregled repozitorija (mock, brez GitHub).",
    requiredTools: ["knowledge.search"],
    requiredPermissions: ["ai"],
    estimatedDuration: "15 min",
    delegate: "repository",
  },
  {
    id: "generate-api",
    name: "Generate API",
    description: "OpenAPI osnutek.",
    requiredTools: ["knowledge.search"],
    requiredPermissions: ["ai"],
    estimatedDuration: "8 min",
    delegate: "developer",
  },
  {
    id: "generate-sql",
    name: "Generate SQL",
    description: "SQL osnutek.",
    requiredTools: [],
    requiredPermissions: ["ai"],
    estimatedDuration: "4 min",
    delegate: "developer",
  },
  {
    id: "generate-pdf",
    name: "Generate PDF",
    description: "PDF artefakt.",
    requiredTools: [],
    requiredPermissions: ["ai"],
    estimatedDuration: "3 min",
    delegate: "sales",
  },
  {
    id: "business-analysis",
    name: "Business Analysis",
    description: "Poslovna analiza iz znanja.",
    requiredTools: ["knowledge.search"],
    requiredPermissions: ["ai"],
    estimatedDuration: "20 min",
    delegate: "knowledge",
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    description: "Osnutek kampanje.",
    requiredTools: ["knowledge.search"],
    requiredPermissions: ["ai"],
    estimatedDuration: "25 min",
    delegate: "sales",
  },
  {
    id: "integration-analysis",
    name: "Integration Analysis",
    description: "Analiza integracij CRM–ERP.",
    requiredTools: ["automation.run", "knowledge.search"],
    requiredPermissions: ["ai"],
    estimatedDuration: "16 min",
    delegate: "erp",
  },
];

export function skillById(id: SkillId): AgentSkill | undefined {
  return agentSkills.find((item) => item.id === id);
}

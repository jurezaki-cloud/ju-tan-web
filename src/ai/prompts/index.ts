import { salesPrompt } from "./sales";
import { crmPrompt } from "./crm";
import { erpPrompt } from "./erp";
import { developerPrompt } from "./developer";
import { automationPrompt } from "./automation";
import { supportPrompt } from "./support";
import { executivePrompt } from "./executive";

export type PromptId =
  | "sales"
  | "crm"
  | "erp"
  | "developer"
  | "automation"
  | "support"
  | "executive";

export const systemPrompts: Record<PromptId, string> = {
  sales: salesPrompt,
  crm: crmPrompt,
  erp: erpPrompt,
  developer: developerPrompt,
  automation: automationPrompt,
  support: supportPrompt,
  executive: executivePrompt,
};

export function getSystemPrompt(id: PromptId): string {
  return systemPrompts[id];
}

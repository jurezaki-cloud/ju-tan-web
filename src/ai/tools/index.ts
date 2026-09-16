import type { ToolRegistry } from "@/src/ai/types/tool";
import { createCrmTools } from "./crm";
import { createProjectTools } from "./project";
import { createDocumentTools, createOfferInvoiceTools, createTicketTools } from "./operations";
import { createAutomationKnowledgeTools, createExternalTools } from "./integrations";
import { createUserProvisioningTools } from "./users";
import { createNotificationTools } from "./notifications";

export function registerDefaultTools(registry: ToolRegistry): void {
  [
    ...createCrmTools(),
    ...createProjectTools(),
    ...createTicketTools(),
    ...createDocumentTools(),
    ...createOfferInvoiceTools(),
    ...createAutomationKnowledgeTools(),
    ...createExternalTools(),
    ...createUserProvisioningTools(),
    ...createNotificationTools(),
  ].forEach((tool) => registry.register(tool));
}

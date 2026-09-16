import { clientRepository } from "@/src/repositories/ClientRepository";
import { leadRepository } from "@/src/repositories/LeadRepository";
import { projectRepository } from "@/src/repositories/ProjectRepository";
import { ticketRepository } from "@/src/repositories/TicketRepository";
import { documentRepository } from "@/src/repositories/DocumentRepository";
import { crmCatalogRepository } from "@/src/repositories/CrmCatalogRepository";
import { documentCatalogRepository } from "@/src/repositories/DocumentCatalogRepository";
import { store } from "@/src/repositories/mock/store";
import { createIntegrations } from "./createIntegrations";
import type { Role } from "@/src/config/roles";

export function createMockIntegrations(role?: Role) {
  return createIntegrations({
    clients: clientRepository,
    leads: leadRepository,
    projects: projectRepository,
    tickets: ticketRepository,
    documents: documentRepository,
    crmCatalog: crmCatalogRepository,
    documentCatalog: documentCatalogRepository,
    catalog: {
      activity: () => store.activity,
      tasks: () => store.tasks,
      integrations: () => store.integrations,
    },
    role,
  });
}


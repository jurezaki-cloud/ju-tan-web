import type {
  Activity,
  Client,
  Contact,
  Lead,
  Note,
  Opportunity,
  ProjectLink,
  Quote,
  Task,
} from "@/src/domain/crm";
import { store } from "./mock/store";
import { contactRepository } from "./ContactRepository";
import { opportunityRepository } from "./OpportunityRepository";
import { activityRepository } from "./ActivityRepository";
import { taskRepository } from "./TaskRepository";
import { noteRepository } from "./NoteRepository";
import { quoteRepository } from "./QuoteRepository";

export class CrmCatalogRepository {
  clients(): Client[] {
    return store.crmClients;
  }

  leads(): Lead[] {
    return store.crmLeads;
  }

  contacts(): Contact[] {
    const rows = contactRepository.list().items;
    return rows.length ? rows : store.crmContacts;
  }

  opportunities(): Opportunity[] {
    const rows = opportunityRepository.list().items;
    return rows.length ? rows : store.crmOpportunities;
  }

  activities(): Activity[] {
    const rows = activityRepository.list().items.filter((item) => item.subject || item.kind || item.clientId);
    return rows.length ? rows : store.crmActivities;
  }

  tasks(): Task[] {
    const rows = taskRepository.list().items.filter((item) => item.priority || item.clientId || item.assigneeId);
    return rows.length ? rows : store.crmTasks;
  }

  notes(): Note[] {
    const rows = noteRepository.list().items;
    return rows.length ? rows : store.crmNotes;
  }

  quotes(): Quote[] {
    const rows = quoteRepository.list().items;
    return rows.length ? rows : store.crmQuotes;
  }

  projectLinks(): ProjectLink[] {
    return store.crmProjectLinks;
  }
}

export const crmCatalogRepository = new CrmCatalogRepository();

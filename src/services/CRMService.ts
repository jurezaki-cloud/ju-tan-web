import { clientService } from "./ClientService";
import { leadService } from "./LeadService";
import { contactService } from "./ContactService";
import { opportunityService } from "./OpportunityService";
import { activityService } from "./ActivityService";
import { taskService } from "./TaskService";
import { noteService } from "./NoteService";
import { quoteService } from "./QuoteService";
import type { Lead } from "@/src/domain/lead";
import type { Result } from "@/src/types/platform";
import { ok } from "@/src/types/platform";
import type { ActivityWrite, CrmSearchHit, CrmTimelineEntry, LeadWrite, TaskWrite } from "@/src/types/crm";
import { clientRepository } from "@/src/repositories/ClientRepository";
import { leadRepository } from "@/src/repositories/LeadRepository";
import { contactRepository } from "@/src/repositories/ContactRepository";
import { opportunityRepository } from "@/src/repositories/OpportunityRepository";
import { activityRepository } from "@/src/repositories/ActivityRepository";
import { taskRepository } from "@/src/repositories/TaskRepository";
import { noteRepository } from "@/src/repositories/NoteRepository";
import { quoteRepository } from "@/src/repositories/QuoteRepository";
import { offerRepository } from "@/src/repositories/OfferRepository";
import { offerService } from "./OfferService";
import { appPersistence } from "@/src/persistence/app";
import { systemCrmAccess, type CrmAccess } from "./crmAccess";

function score(haystack: string, query: string): number {
  const h = haystack.toLowerCase();
  const q = query.toLowerCase();
  if (!q) return 0;
  if (h === q) return 1;
  if (h.startsWith(q)) return 0.9;
  if (h.includes(q)) return 0.7;
  return 0;
}

export class CRMService {
  listLeads(): Result<Lead[]> {
    return leadService.list();
  }

  createLead(input: Omit<Lead, "id">): Result<Lead> {
    return leadService.createLead(input);
  }

  createLeadWithActivity(input: LeadWrite, activity: ActivityWrite, access: CrmAccess = systemCrmAccess): Result<Lead> {
    const lead = leadService.create(input, access);
    if (!lead.ok) return lead;
    activityService.create({ ...activity, leadId: lead.data.id, clientId: lead.data.companyId }, access);
    return lead;
  }

  createTask(input: TaskWrite, access: CrmAccess = systemCrmAccess) {
    return taskService.create(input, access);
  }

  createQuoteDraft(clientId: string, access: CrmAccess = systemCrmAccess) {
    return quoteService.draftFromClient(clientId, access);
  }

  suggestNextActivity(clientId: string): Result<{ type: string; subject: string }> {
    const tasks = taskRepository.getByClientId(clientId);
    const open = tasks.find((item) => item.status !== "done");
    if (open) return ok({ type: "task", subject: `Nadaljuj: ${open.name}` });
    return ok({ type: "call", subject: "Klic za preverbo statusa" });
  }

  summarizeTimeline(clientId: string): Result<string> {
    const timeline = this.timeline(clientId);
    if (!timeline.ok) return timeline;
    const text = timeline.data
      .slice(0, 8)
      .map((item) => `${item.at}: ${item.title}`)
      .join("\n");
    return ok(text || "Ni dogodkov.");
  }

  search(query: string): Result<CrmSearchHit[]> {
    const q = query.trim();
    if (!q) return ok([]);
    const hits: CrmSearchHit[] = [];
    for (const client of clientRepository.list()) {
      const relevance = Math.max(score(client.name, q), score(client.email, q));
      if (relevance > 0.2) {
        hits.push({
          type: "client",
          id: client.id,
          title: client.name,
          subtitle: client.industry,
          route: `/clients/${client.id}`,
          relevance,
          metadata: { status: client.status },
        });
      }
    }
    for (const lead of leadRepository.list()) {
      const relevance = Math.max(score(lead.name, q), score(lead.company, q), score(lead.email, q));
      if (relevance > 0.2) {
        hits.push({
          type: "lead",
          id: lead.id,
          title: lead.name,
          subtitle: lead.company,
          route: `/crm/leads`,
          relevance,
          metadata: { status: lead.status },
        });
      }
    }
    for (const contact of contactRepository.search(q)) {
      hits.push({
        type: "contact",
        id: contact.id,
        title: `${contact.firstName} ${contact.lastName}`.trim(),
        subtitle: contact.email ?? "",
        route: contact.clientId ? `/clients/${contact.clientId}` : "/crm",
        relevance: 0.7,
        metadata: { role: contact.role },
      });
    }
    for (const opportunity of opportunityRepository.search(q)) {
      hits.push({
        type: "opportunity",
        id: opportunity.id,
        title: opportunity.name,
        subtitle: opportunity.amount ?? "",
        route: "/crm/opportunities",
        relevance: 0.65,
        metadata: { stage: opportunity.stage },
      });
    }
    for (const task of taskRepository.search(q)) {
      hits.push({
        type: "task",
        id: task.id,
        title: task.name,
        subtitle: task.dueAt ?? task.due ?? "",
        route: "/crm/tasks",
        relevance: 0.6,
        metadata: { priority: task.priority },
      });
    }
    for (const note of noteRepository.search(q)) {
      hits.push({
        type: "note",
        id: note.id,
        title: (note.body ?? note.name ?? "").slice(0, 48),
        subtitle: note.clientId ?? "",
        route: note.clientId ? `/clients/${note.clientId}` : "/crm/notes",
        relevance: 0.55,
        metadata: { pinned: note.pinned },
      });
    }
    for (const quote of quoteRepository.search(q)) {
      hits.push({
        type: "quote",
        id: quote.id,
        title: quote.title ?? quote.name,
        subtitle: quote.amount ?? "",
        route: "/crm/quotes",
        relevance: 0.65,
        metadata: { number: quote.number },
      });
    }
    const offers = offerService.search(q);
    if (offers.ok) {
      for (const hit of offers.data) {
        if (hit.type === "offer") {
          hits.push({
            type: "offer",
            id: hit.id,
            title: hit.title,
            subtitle: hit.subtitle,
            route: hit.route,
            relevance: hit.relevance,
            metadata: hit.metadata,
          });
        }
      }
    }
    for (const activity of activityRepository.search(q)) {
      hits.push({
        type: "activity",
        id: activity.id,
        title: activity.subject ?? activity.name,
        subtitle: activity.type ?? "",
        route: "/crm/activities",
        relevance: 0.5,
        metadata: { status: activity.status },
      });
    }
    return ok(hits.sort((a, b) => b.relevance - a.relevance).slice(0, 25));
  }

  timeline(clientId: string): Result<CrmTimelineEntry[]> {
    const entries: CrmTimelineEntry[] = [];
    const client = clientRepository.getById(clientId);
    if (client) {
      entries.push({
        id: `tl-client-${client.id}`,
        at: new Date().toISOString(),
        kind: "client-created",
        title: `Stranka ${client.name}`,
        clientId,
      });
    }
    for (const lead of leadRepository.getByClientId(clientId)) {
      entries.push({ id: `tl-lead-${lead.id}`, at: lead.lastContact, kind: "lead-created", title: `Lead: ${lead.name}`, clientId });
    }
    for (const note of noteRepository.getByClientId(clientId)) {
      entries.push({ id: `tl-note-${note.id}`, at: note.createdAt, kind: "note-added", title: "Opomba", subtitle: note.body, clientId });
    }
    for (const activity of activityRepository.getByClientId(clientId)) {
      if (activity.completedAt) {
        entries.push({
          id: `tl-act-${activity.id}`,
          at: activity.completedAt,
          kind: "activity-completed",
          title: activity.subject ?? activity.name,
          clientId,
        });
      }
    }
    for (const quote of quoteRepository.getByClientId(clientId)) {
      entries.push({ id: `tl-qt-${quote.id}`, at: quote.createdAt, kind: "quote-created", title: quote.title ?? quote.name, clientId });
    }
    for (const offer of offerRepository.getByClientId(clientId)) {
      entries.push({
        id: `tl-of-${offer.id}`,
        at: offer.updatedAt,
        kind: "quote-created",
        title: `${offer.number} · ${offer.title}`,
        subtitle: offer.status,
        clientId,
      });
    }
    for (const opportunity of opportunityRepository.getByClientId(clientId)) {
      if (opportunity.metadata.previousStage) {
        entries.push({
          id: `tl-op-${opportunity.id}`,
          at: opportunity.updatedAt,
          kind: "opportunity-stage-changed",
          title: `${opportunity.name}: ${opportunity.stage}`,
          clientId,
        });
      }
    }
    for (const task of taskRepository.getByClientId(clientId)) {
      if (task.dueAt || task.due) {
        entries.push({
          id: `tl-tk-${task.id}`,
          at: task.dueAt ?? task.updatedAt,
          kind: "task-due",
          title: task.name,
          clientId,
        });
      }
    }
    for (const audit of appPersistence.repositories.audit.list()) {
      const data = audit as { id: string; type?: string; at?: string; clientId?: string };
      if (data.clientId === clientId || String(data.type ?? "").includes("Client")) {
        entries.push({
          id: `tl-aud-${data.id}`,
          at: data.at ?? new Date().toISOString(),
          kind: "audit",
          title: String(data.type ?? "audit"),
          clientId,
        });
      }
    }
    return ok(entries.sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 40));
  }

  contextForAi(clientId?: string) {
    const client = clientId ? clientRepository.getById(clientId) : undefined;
    return {
      client,
      leads: clientId ? leadRepository.getByClientId(clientId) : leadRepository.list(),
      activities: clientId ? activityRepository.getByClientId(clientId) : activityRepository.list().items,
      tasks: clientId ? taskRepository.getByClientId(clientId) : taskRepository.list().items,
      quotes: clientId ? quoteRepository.getByClientId(clientId) : quoteRepository.list().items,
      offers: clientId ? offerRepository.getByClientId(clientId) : offerRepository.list().items,
      summary: client ? `CRM: ${client.name} · ${client.status}` : "CRM kontekst",
    };
  }
}

export const crmService = new CRMService();
export { clientService, leadService, contactService, opportunityService, activityService, taskService, noteService, quoteService };

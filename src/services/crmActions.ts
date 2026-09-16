"use server";

import { revalidatePath } from "next/cache";
import { clientService } from "@/src/services/ClientService";
import { leadService } from "@/src/services/LeadService";
import { contactService } from "@/src/services/ContactService";
import { opportunityService } from "@/src/services/OpportunityService";
import { activityService } from "@/src/services/ActivityService";
import { taskService } from "@/src/services/TaskService";
import { noteService } from "@/src/services/NoteService";
import { quoteService } from "@/src/services/QuoteService";
import { crmAccessFor, systemCrmAccess } from "@/src/services/crmAccess";
import { readAccessToken } from "@/src/identity/adapters/cookies";
import { getIdentity } from "@/src/identity";
import { AuthError } from "@/src/identity/auth/AuthService";
import type { Role } from "@/src/config/roles";

async function access() {
  const token = await readAccessToken();
  if (!token) return systemCrmAccess;
  try {
    const user = getIdentity().controller.session(token).user;
    return crmAccessFor(user.role as Role, user.id);
  } catch (error) {
    if (error instanceof AuthError) return systemCrmAccess;
    throw error;
  }
}

function revalidateCrm(clientId?: string) {
  revalidatePath("/crm");
  revalidatePath("/clients");
  revalidatePath("/crm/leads");
  revalidatePath("/crm/opportunities");
  revalidatePath("/crm/activities");
  revalidatePath("/crm/tasks");
  revalidatePath("/crm/notes");
  revalidatePath("/crm/quotes");
  if (clientId) revalidatePath(`/clients/${clientId}`);
}

export async function createClientAction(formData: FormData) {
  const result = await Promise.resolve(
    clientService.create(
      {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        industry: String(formData.get("industry") ?? ""),
        city: String(formData.get("city") ?? ""),
        contactName: String(formData.get("contactName") ?? ""),
        website: String(formData.get("website") ?? ""),
      },
      await access(),
    ),
  );
  if (result.ok) revalidateCrm(result.data.id);
  return result;
}

export async function updateClientAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const result = clientService.update(
    id,
    {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      city: String(formData.get("city") ?? ""),
      contactName: String(formData.get("contactName") ?? ""),
    },
    await access(),
  );
  if (result.ok) revalidateCrm(id);
}

export async function archiveClientAction(id: string) {
  const result = clientService.archive(id, await access());
  revalidateCrm(id);
  return result;
}

export async function restoreClientAction(id: string) {
  const result = clientService.restore(id, await access());
  revalidateCrm(id);
  return result;
}

export async function createLeadAction(formData: FormData) {
  const result = leadService.create(
    {
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      clientId: String(formData.get("clientId") ?? ""),
      source: String(formData.get("source") ?? ""),
      pipelineStage: String(formData.get("pipelineStage") ?? ""),
      expectedValue: String(formData.get("expectedValue") ?? ""),
    },
    await access(),
  );
  if (result.ok) revalidateCrm(result.data.companyId);
  return result;
}

export async function updateLeadAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  leadService.update(
    id,
    {
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      status: String(formData.get("status") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      clientId: String(formData.get("clientId") ?? ""),
    },
    await access(),
  );
  revalidateCrm();
}

export async function archiveLeadAction(id: string) {
  const result = leadService.archive(id, await access());
  revalidateCrm();
  return result;
}

export async function createContactAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const result = contactService.create(
    {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      role: String(formData.get("role") ?? ""),
      clientId,
    },
    await access(),
  );
  if (result.ok) revalidateCrm(clientId);
  return result;
}

export async function createOpportunityAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const result = opportunityService.create(
    {
      name: String(formData.get("name") ?? ""),
      amount: String(formData.get("amount") ?? ""),
      stage: String(formData.get("stage") ?? ""),
      closeDate: String(formData.get("closeDate") ?? ""),
      clientId,
    },
    await access(),
  );
  if (result.ok) revalidateCrm(clientId);
  return result;
}

export async function createTaskAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const result = taskService.create(
    {
      name: String(formData.get("name") ?? ""),
      priority: String(formData.get("priority") ?? "Srednja"),
      dueAt: String(formData.get("dueAt") ?? ""),
      clientId,
    },
    await access(),
  );
  if (result.ok) revalidateCrm(clientId);
  return result;
}

export async function createNoteAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const result = noteService.create(
    {
      body: String(formData.get("body") ?? ""),
      pinned: formData.get("pinned") === "on",
      clientId,
    },
    await access(),
  );
  if (result.ok) revalidateCrm(clientId);
  return result;
}

export async function createQuoteAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const result = quoteService.create(
    {
      title: String(formData.get("title") ?? ""),
      amount: String(formData.get("amount") ?? ""),
      currency: String(formData.get("currency") ?? "EUR"),
      expiresAt: String(formData.get("expiresAt") ?? ""),
      clientId,
    },
    await access(),
  );
  if (result.ok) revalidateCrm(clientId);
  return result;
}

export async function createActivityAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const result = activityService.create(
    {
      subject: String(formData.get("subject") ?? ""),
      type: String(formData.get("type") ?? "call"),
      clientId,
    },
    await access(),
  );
  if (result.ok) revalidateCrm(clientId);
  return result;
}

export async function archiveRecordAction(kind: string, id: string, clientId?: string) {
  const actor = await access();
  if (kind === "task") await taskService.archive(id, actor);
  if (kind === "note") await noteService.archive(id, actor);
  if (kind === "quote") await quoteService.archive(id, actor);
  if (kind === "opportunity") await opportunityService.archive(id, actor);
  if (kind === "activity") await activityService.archive(id, actor);
  if (kind === "contact") await contactService.archive(id, actor);
  revalidateCrm(clientId);
}

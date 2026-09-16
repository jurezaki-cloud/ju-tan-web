"use server";

import { revalidatePath } from "next/cache";
import { readAccessToken } from "@/src/identity/adapters/cookies";
import { getIdentity } from "@/src/identity";
import { AuthError } from "@/src/identity/auth/AuthService";
import type { Role } from "@/src/config/roles";
import { offerAccessFor, systemOfferAccess } from "./offerAccess";
import { offerService } from "./OfferService";
import { offerDraftService } from "./OfferDraftService";
import { offerApprovalService } from "./OfferApprovalService";
import { offerLineService } from "./OfferLineService";
import { offerTemplateService } from "./OfferTemplateService";

async function access() {
  const token = await readAccessToken();
  if (!token) return systemOfferAccess;
  try {
    const user = getIdentity().controller.session(token).user;
    return offerAccessFor(user.role as Role, user.id);
  } catch (error) {
    if (error instanceof AuthError) return systemOfferAccess;
    throw error;
  }
}

function revalidateOffers(id?: string, clientId?: string) {
  revalidatePath("/crm");
  revalidatePath("/crm/offers");
  revalidatePath("/crm/offers/templates");
  revalidatePath("/crm/quotes");
  revalidatePath("/clients");
  revalidatePath("/crm/leads");
  if (id) {
    revalidatePath(`/crm/offers/${id}`);
    revalidatePath(`/crm/offers/${id}/draft`);
    revalidatePath(`/crm/offers/${id}/approve`);
    revalidatePath(`/crm/offers/${id}/revisions`);
    revalidatePath(`/crm/offers/${id}/timeline`);
  }
  if (clientId) revalidatePath(`/clients/${clientId}`);
}

export async function createOfferAction(formData: FormData) {
  const result = offerDraftService.fromLead(
    {
      title: String(formData.get("title") ?? ""),
      clientId: String(formData.get("clientId") ?? "") || undefined,
      leadId: String(formData.get("leadId") ?? "") || undefined,
      opportunityId: String(formData.get("opportunityId") ?? "") || undefined,
      notes: String(formData.get("notes") ?? "") || undefined,
      source: formData.get("leadId") ? "lead" : "manual",
    },
    await access(),
  );
  if (result.ok) revalidateOffers(result.data.id, result.data.clientId);
  return result;
}

export async function updateOfferAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const result = offerService.update(
    id,
    {
      title: String(formData.get("title") ?? ""),
      clientId: String(formData.get("clientId") ?? "") || undefined,
      leadId: String(formData.get("leadId") ?? "") || undefined,
      projectId: String(formData.get("projectId") ?? "") || undefined,
      validUntil: String(formData.get("validUntil") ?? "") || undefined,
      currency: String(formData.get("currency") ?? "") || undefined,
    },
    await access(),
  );
  if (result.ok) revalidateOffers(id, result.data.clientId);
}

export async function addOfferLineAction(formData: FormData): Promise<void> {
  const offerId = String(formData.get("offerId") ?? "");
  offerLineService.add(
    {
      offerId,
      label: String(formData.get("label") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      quantity: Number(formData.get("quantity") ?? 1),
      unitPrice: Number(formData.get("unitPrice") ?? 0),
      taxRate: Number(formData.get("taxRate") ?? 22),
    },
    await access(),
  );
  revalidateOffers(offerId);
}

export async function reviseOfferAction(formData: FormData): Promise<void> {
  const offerId = String(formData.get("offerId") ?? "");
  await Promise.resolve(
    offerDraftService.revise(
      {
        offerId,
        changeSummary: String(formData.get("changeSummary") ?? ""),
      },
      await access(),
    ),
  );
  revalidateOffers(offerId);
}

export async function requestOfferApprovalAction(formData: FormData): Promise<void> {
  const offerId = String(formData.get("offerId") ?? "");
  await offerApprovalService.request(
    {
      offerId,
      comment: String(formData.get("comment") ?? "") || undefined,
    },
    await access(),
  );
  revalidateOffers(offerId);
}

export async function grantOfferApprovalAction(formData: FormData): Promise<void> {
  const offerId = String(formData.get("offerId") ?? "");
  await offerApprovalService.grant(offerId, await access(), String(formData.get("comment") ?? "") || undefined);
  revalidateOffers(offerId);
}

export async function rejectOfferApprovalAction(formData: FormData): Promise<void> {
  const offerId = String(formData.get("offerId") ?? "");
  offerApprovalService.reject(offerId, await access(), String(formData.get("comment") ?? "") || undefined);
  revalidateOffers(offerId);
}

export async function generateOfferPdfAction(formData: FormData): Promise<void> {
  const offerId = String(formData.get("offerId") ?? "");
  offerService.generatePdf(offerId, await access());
  revalidateOffers(offerId);
}

export async function prepareOfferEmailAction(formData: FormData): Promise<void> {
  const offerId = String(formData.get("offerId") ?? "");
  offerService.prepareEmail(offerId, await access());
  revalidateOffers(offerId);
}

export async function sendOfferAction(formData: FormData): Promise<void> {
  const offerId = String(formData.get("offerId") ?? "");
  offerService.send(offerId, await access());
  revalidateOffers(offerId);
}

export async function archiveOfferAction(id: string): Promise<void> {
  offerService.archive(id, await access());
  revalidateOffers(id);
}

export async function createOfferTemplateAction(formData: FormData) {
  const result = offerTemplateService.create(
    String(formData.get("name") ?? ""),
    String(formData.get("title") ?? ""),
    await access(),
  );
  if (result.ok) revalidateOffers();
  return result;
}

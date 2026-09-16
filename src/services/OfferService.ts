import { offerRepository } from "@/src/repositories/OfferRepository";
import { offerLineRepository } from "@/src/repositories/OfferLineRepository";
import { offerDraftRepository } from "@/src/repositories/OfferDraftRepository";
import { offerRevisionRepository } from "@/src/repositories/OfferRevisionRepository";
import { offerApprovalRepository } from "@/src/repositories/OfferApprovalRepository";
import { offerTemplateRepository } from "@/src/repositories/OfferTemplateRepository";
import { offerAttachmentRepository } from "@/src/repositories/OfferAttachmentRepository";
import { clientRepository } from "@/src/repositories/ClientRepository";
import { leadRepository } from "@/src/repositories/LeadRepository";
import { projectRepository } from "@/src/repositories/ProjectRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Offer, OfferAttachment, OfferStatus } from "@/src/domain/offers";
import type { OfferListResult, OfferQueryParams, OfferSearchHit, OfferTimelineEntry, OfferWrite } from "@/src/types/offers";
import { recordOfferAudit } from "./offerAudit";
import { systemOfferAccess, type OfferAccess } from "./offerAccess";
import { nextCrmId, stampCrm } from "./crmStamp";
import { appPersistence } from "@/src/persistence/app";
import { pushStatus } from "./offerStatus";
import { offerDraftService } from "./OfferDraftService";
import type { Document } from "@/src/domain/document";

export class OfferService {
  list(params: OfferQueryParams = {}, access: OfferAccess = systemOfferAccess): Result<OfferListResult<Offer>> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    try {
      return ok(offerRepository.list(params));
    } catch {
      return err("Ponudb ni bilo mogoče naložiti.");
    }
  }

  getById(id: string, access: OfferAccess = systemOfferAccess): Result<Offer> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    const item = offerRepository.getById(id);
    if (!item) return err("Ponudba ne obstaja.");
    return ok(item);
  }

  getByClientId(clientId: string, access: OfferAccess = systemOfferAccess): Result<Offer[]> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    return ok(offerRepository.getByClientId(clientId));
  }

  getByLeadId(leadId: string, access: OfferAccess = systemOfferAccess): Result<Offer[]> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    return ok(offerRepository.getByLeadId(leadId));
  }

  getByProjectId(projectId: string, access: OfferAccess = systemOfferAccess): Result<Offer[]> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    return ok(offerRepository.getByProjectId(projectId));
  }

  create(input: OfferWrite, access: OfferAccess = systemOfferAccess): Result<Offer> {
    return offerDraftService.fromLead({
      title: input.title,
      clientId: input.clientId,
      leadId: input.leadId,
      opportunityId: input.opportunityId,
      source: "manual",
    }, access);
  }

  update(id: string, input: Partial<OfferWrite>, access: OfferAccess = systemOfferAccess): Result<Offer> {
    if (!access.write) return err("Ni dovoljenja za zapis ponudbe.");
    const current = offerRepository.getById(id);
    if (!current) return err("Ponudba ne obstaja.");
    const next = {
      ...current,
      title: input.title?.trim() || current.title,
      clientId: input.clientId ?? current.clientId,
      leadId: input.leadId ?? current.leadId,
      projectId: input.projectId ?? current.projectId,
      validUntil: input.validUntil ?? current.validUntil,
      currency: input.currency ?? current.currency,
      updatedAt: new Date().toISOString(),
      version: (current.version ?? 1) + 1,
    };
    offerRepository.update(next);
    recordOfferAudit("OfferUpdated", { id });
    return ok(next);
  }

  summary(id: string, access: OfferAccess = systemOfferAccess): Result<string> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    const offer = offerRepository.getById(id);
    if (!offer) return err("Ponudba ne obstaja.");
    const draft = offerDraftRepository.getByOfferId(id)[0];
    const lines = offerLineRepository.getByOfferId(id);
    const text = [
      `${offer.number} · ${offer.title} · ${offer.status}`,
      `Skupaj: ${offer.total} ${offer.currency}`,
      `Postavke: ${lines.map((item) => item.label).join(", ") || "—"}`,
      draft?.aiSummary ?? "",
      draft?.risks ? `Tveganja: ${draft.risks}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return ok(text);
  }

  generatePdf(id: string, access: OfferAccess = systemOfferAccess): Result<{ offer: Offer; artifactId: string }> {
    if (!access.write) return err("Ni dovoljenja za PDF.");
    const offer = offerRepository.getById(id);
    if (!offer) return err("Ponudba ne obstaja.");
    const artifactId = offer.pdfArtifactId ?? `art-off-${offer.id}`;
    const documentId = offer.documentId ?? `doc-off-${offer.id}`;
    const document: Document = {
      id: documentId,
      name: `${offer.number}.pdf`,
      folder: "Ponudbe",
      clientId: offer.clientId ?? "",
      clientName: offer.clientId ? clientRepository.getById(offer.clientId)?.name ?? "" : "",
      updated: new Date().toISOString().slice(0, 10),
      kind: "PDF",
    };
    const nextStatus: OfferStatus = offer.status === "Draft" ? "InReview" : (offer.status as OfferStatus);
    const next: Offer = {
      ...pushStatus(offer, nextStatus),
      pdfArtifactId: artifactId,
      documentId,
      issuedAt: offer.issuedAt ?? new Date().toISOString(),
    };
    appPersistence.transactions.createOfferPdfBundle(next, artifactId, document);
    const attachment = stampCrm<OfferAttachment>(`${offer.id}-pdf`, "active", {
      offerId: offer.id,
      kind: "PDF",
      title: document.name,
      artifactId,
      uri: `mock://artifacts/${artifactId}`,
    });
    offerAttachmentRepository.create(attachment);
    recordOfferAudit("OfferPdfGenerated", { id: offer.id, artifactId, documentId });
    return ok({ offer: next, artifactId });
  }

  linkArtifact(id: string, artifactId: string, access: OfferAccess = systemOfferAccess): Result<OfferAttachment> {
    if (!access.write) return err("Ni dovoljenja za povezavo artifacta.");
    const offer = offerRepository.getById(id);
    if (!offer) return err("Ponudba ne obstaja.");
    const row = stampCrm<OfferAttachment>(nextCrmId("oafile", offerAttachmentRepository.count()), "active", {
      offerId: id,
      kind: "JSON",
      title: "Offer artifact",
      artifactId,
      uri: `mock://artifacts/${artifactId}`,
    });
    offerAttachmentRepository.create(row);
    offerRepository.update({ ...offer, pdfArtifactId: offer.pdfArtifactId ?? artifactId, updatedAt: new Date().toISOString() });
    return ok(row);
  }

  prepareEmail(id: string, access: OfferAccess = systemOfferAccess): Result<string> {
    if (!access.write) return err("Ni dovoljenja za e-poštni osnutek.");
    const offer = offerRepository.getById(id);
    if (!offer) return err("Ponudba ne obstaja.");
    const body = `Spoštovani,\n\nv prilogi je ponudba ${offer.number} (${offer.title}) v vrednosti ${offer.total} ${offer.currency}.\nVeljavnost: ${offer.validUntil ?? "—"}.\n\nJU-TAN`;
    offerRepository.update({ ...offer, emailDraft: body, updatedAt: new Date().toISOString() });
    return ok(body);
  }

  send(id: string, access: OfferAccess = systemOfferAccess): Result<Offer> {
    if (!access.send) return err("Pošiljanje ponudbe je omejeno (Offer.Send).");
    const offer = offerRepository.getById(id);
    if (!offer) return err("Ponudba ne obstaja.");
    if (offer.status !== "Approved") return err("Ponudbo je mogoče poslati šele po odobritvi.");
    const next = pushStatus(
      { ...offer, sentAt: new Date().toISOString(), emailSentTo: offer.clientId },
      "Sent",
    );
    appPersistence.transactions.sendOfferWithAudit(next);
    recordOfferAudit("OfferSent", { id: offer.id });
    return ok(next);
  }

  archive(id: string, access: OfferAccess = systemOfferAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    appPersistence.transactions.archiveOfferWithAudit(id);
    recordOfferAudit("OfferArchived", { id });
    return ok(true);
  }

  restore(id: string, access: OfferAccess = systemOfferAccess): Result<Offer> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    const item = offerRepository.restore(id);
    if (!item) return err("Ponudbe ni bilo mogoče obnoviti.");
    recordOfferAudit("OfferRestored", { id });
    return ok(item);
  }

  timeline(offerId: string, access: OfferAccess = systemOfferAccess): Result<OfferTimelineEntry[]> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    const entries: OfferTimelineEntry[] = [];
    const offer = offerRepository.getById(offerId);
    if (!offer) return err("Ponudba ne obstaja.");
    for (const draft of offerDraftRepository.getByOfferId(offerId)) {
      entries.push({ id: draft.id, at: draft.createdAt, kind: "draft-created", title: "Osnutek ustvarjen", offerId });
    }
    for (const line of offerLineRepository.getByOfferId(offerId)) {
      entries.push({ id: line.id, at: line.createdAt, kind: "line-item-added", title: line.label, offerId });
    }
    for (const revision of offerRevisionRepository.getByOfferId(offerId)) {
      entries.push({ id: revision.id, at: revision.createdAt, kind: "revision-created", title: `Revizija ${revision.revisionNumber}`, subtitle: revision.changeSummary, offerId });
    }
    for (const approval of offerApprovalRepository.getByOfferId(offerId)) {
      entries.push({
        id: approval.id,
        at: approval.approvedAt ?? approval.createdAt,
        kind: approval.decision === "granted" ? "approval-granted" : "approval-requested",
        title: approval.decision === "granted" ? "Odobreno" : "Zahtevana odobritev",
        offerId,
      });
    }
    if (offer.pdfArtifactId) {
      entries.push({ id: `pdf-${offer.id}`, at: offer.issuedAt ?? offer.updatedAt, kind: "pdf-generated", title: "PDF artifact", offerId });
    }
    if (offer.emailDraft) {
      entries.push({ id: `em-${offer.id}`, at: offer.updatedAt, kind: "email-drafted", title: "Osnutek e-pošte", offerId });
    }
    if (offer.sentAt) {
      entries.push({ id: `sent-${offer.id}`, at: offer.sentAt, kind: "email-sent", title: "Poslano", offerId });
    }
    if (offer.status === "Archived" || offer.deletedAt) {
      entries.push({ id: `arch-${offer.id}`, at: offer.updatedAt, kind: "archived", title: "Arhivirano", offerId });
    }
    return ok(entries.sort((a, b) => b.at.localeCompare(a.at)));
  }

  search(query: string, access: OfferAccess = systemOfferAccess): Result<OfferSearchHit[]> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    const q = query.trim().toLowerCase();
    if (!q) return ok([]);
    const hits: OfferSearchHit[] = [];
    const score = (value: string) => (value.toLowerCase().includes(q) ? (value.toLowerCase() === q ? 1 : 0.7) : 0);
    for (const offer of offerRepository.search(query)) {
      hits.push({
        type: "offer",
        id: offer.id,
        title: offer.title,
        subtitle: `${offer.number} · ${offer.total} ${offer.currency}`,
        route: `/crm/offers/${offer.id}`,
        relevance: Math.max(score(offer.title), score(offer.number)),
        metadata: { status: offer.status },
      });
    }
    for (const draft of offerDraftRepository.search(query)) {
      hits.push({
        type: "offer-draft",
        id: draft.id,
        title: draft.aiSummary ?? "Osnutek",
        subtitle: draft.source,
        route: `/crm/offers/${draft.offerId}/draft`,
        relevance: 0.6,
        metadata: { offerId: draft.offerId },
      });
    }
    for (const revision of offerRevisionRepository.search(query)) {
      hits.push({
        type: "revision",
        id: revision.id,
        title: revision.changeSummary,
        subtitle: `R${revision.revisionNumber}`,
        route: `/crm/offers/${revision.offerId}/revisions`,
        relevance: 0.55,
        metadata: { offerId: revision.offerId },
      });
    }
    for (const approval of offerApprovalRepository.search(query)) {
      hits.push({
        type: "approval",
        id: approval.id,
        title: approval.decision,
        subtitle: approval.comment ?? "",
        route: `/crm/offers/${approval.offerId}/approve`,
        relevance: 0.5,
        metadata: { offerId: approval.offerId },
      });
    }
    for (const template of offerTemplateRepository.search(query)) {
      hits.push({
        type: "offer-template",
        id: template.id,
        title: template.name,
        subtitle: template.title,
        route: "/crm/offers/templates",
        relevance: 0.5,
        metadata: {},
      });
    }
    for (const client of clientRepository.search(query)) {
      hits.push({
        type: "client",
        id: client.id,
        title: client.name,
        subtitle: "Stranka",
        route: `/clients/${client.id}`,
        relevance: 0.45,
        metadata: {},
      });
    }
    for (const lead of leadRepository.search(query)) {
      hits.push({
        type: "lead",
        id: lead.id,
        title: lead.name,
        subtitle: lead.company,
        route: `/crm/leads/${lead.id}`,
        relevance: 0.45,
        metadata: {},
      });
    }
    for (const project of projectRepository.list()) {
      const relevance = score(project.name);
      if (relevance > 0) {
        hits.push({
          type: "project",
          id: project.id,
          title: project.name,
          subtitle: project.status,
          route: "/projects",
          relevance,
          metadata: { clientId: project.clientId },
        });
      }
    }
    for (const artifact of appPersistence.repositories.artifacts.list()) {
      const title = String((artifact as { title?: string }).title ?? artifact.id);
      const relevance = score(title) || score(artifact.id);
      if (relevance > 0) {
        hits.push({
          type: "artifact",
          id: artifact.id,
          title,
          subtitle: "Artifact",
          route: "/documents",
          relevance,
          metadata: {},
        });
      }
    }
    return ok(hits.sort((a, b) => b.relevance - a.relevance).slice(0, 25));
  }

  contextForAi(offerId: string) {
    const offer = offerRepository.getById(offerId);
    return {
      offer,
      lines: offerLineRepository.getByOfferId(offerId),
      draft: offerDraftRepository.getByOfferId(offerId)[0],
      summary: offer ? this.summary(offerId) : undefined,
    };
  }
}

export const offerService = new OfferService();

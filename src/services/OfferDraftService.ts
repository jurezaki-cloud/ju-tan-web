import { offerRepository } from "@/src/repositories/OfferRepository";
import { offerDraftRepository } from "@/src/repositories/OfferDraftRepository";
import { offerRevisionRepository } from "@/src/repositories/OfferRevisionRepository";
import { leadRepository } from "@/src/repositories/LeadRepository";
import { clientRepository } from "@/src/repositories/ClientRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Offer, OfferDraft, OfferLine, OfferRevision, OfferStatusHistory } from "@/src/domain/offers";
import type { OfferDraftWrite, OfferRevisionWrite } from "@/src/types/offers";
import { recordOfferAudit } from "./offerAudit";
import { systemOfferAccess, type OfferAccess } from "./offerAccess";
import { nextCrmId, stampCrm } from "./crmStamp";
import { computeLineTotal, computeOfferTotals } from "./OfferLineService";
import { appPersistence } from "@/src/persistence/app";
import { pushStatus } from "./offerStatus";

function defaultLines(offerId: string, taxRate: number): OfferLine[] {
  const items = [
    { label: "Analiza in načrt", quantity: 1, unitPrice: 1200 },
    { label: "Implementacija", quantity: 1, unitPrice: 4800 },
  ];
  return items.map((item, index) =>
    stampCrm<OfferLine>(`${offerId}-l${index + 1}`, "active", {
      offerId,
      label: item.label,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate,
      total: computeLineTotal(item.quantity, item.unitPrice, taxRate),
      sortOrder: index + 1,
    }),
  );
}

export class OfferDraftService {
  fromLead(input: OfferDraftWrite, access: OfferAccess = systemOfferAccess): Result<Offer> {
    if (!access.write) return err("Ni dovoljenja za osnutek ponudbe.");
    const lead = input.leadId ? leadRepository.getById(input.leadId) : undefined;
    const clientId = input.clientId ?? (lead as { companyId?: string; clientId?: string } | undefined)?.companyId ?? (lead as { clientId?: string } | undefined)?.clientId;
    const client = clientId ? clientRepository.getById(clientId) : undefined;
    const title = input.title?.trim() || `Ponudba ${client?.name ?? lead?.company ?? "JU-TAN"}`;
    const id = nextCrmId("of", offerRepository.count());
    const lines = defaultLines(id, 22);
    const totals = computeOfferTotals(lines);
    const offer = stampCrm<Offer>(id, "Draft", {
      number: `P-${String(offerRepository.count() + 1).padStart(4, "0")}`,
      title,
      clientId,
      leadId: input.leadId ?? lead?.id,
      opportunityId: input.opportunityId,
      currency: "EUR",
      ...totals,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
    });
    const draft = stampCrm<OfferDraft>(`${id}-draft`, "Draft", {
      offerId: id,
      source: input.source ?? (input.leadId ? "lead" : "ai"),
      aiSummary: `Osnutek za ${title}. Predpostavke: obseg po dogovoru, DDV 22 %.`,
      assumptions: "Obseg dela je usklajen s stranko. Licenčnine niso vključene.",
      notes: input.notes,
      risks: "Zamuda pri podpisu lahko premakne rok uvedbe.",
    });
    const history = stampCrm<OfferStatusHistory>(`${id}-h0`, "Draft", {
      offerId: id,
      toStatus: "Draft",
      note: "Ustvarjen AI/manual osnutek",
    });
    appPersistence.transactions.createOfferDraftBundle(offer, draft, lines, history);
    recordOfferAudit("OfferDraftCreated", { id, clientId, leadId: offer.leadId });
    recordOfferAudit("OfferCreated", { id });
    return ok(offer);
  }

  getByOffer(offerId: string, access: OfferAccess = systemOfferAccess): Result<OfferDraft> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    const draft = offerDraftRepository.getByOfferId(offerId)[0];
    if (!draft) return err("Osnutek ne obstaja.");
    return ok(draft);
  }

  revise(input: OfferRevisionWrite, access: OfferAccess = systemOfferAccess): Result<OfferRevision> {
    if (!access.write) return err("Ni dovoljenja za revizijo.");
    const offer = offerRepository.getById(input.offerId);
    if (!offer) return err("Ponudba ne obstaja.");
    const number = offerRevisionRepository.getByOfferId(input.offerId).length + 1;
    const revision = stampCrm<OfferRevision>(`${offer.id}-r${number}`, "active", {
      offerId: offer.id,
      revisionNumber: number,
      changeSummary: input.changeSummary.trim() || "Posodobitev osnutka",
      changedBy: input.changedBy ?? access.userId,
    });
    const next = pushStatus(offer, offer.status === "Approved" ? "InReview" : "InReview");
    appPersistence.transactions.createOfferRevisionBundle(next, revision);
    recordOfferAudit("OfferRevisionCreated", { id: offer.id, revision: number });
    return ok(revision);
  }

  suggestLines(offerId: string, access: OfferAccess = systemOfferAccess): Result<{ label: string; unitPrice: number }[]> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    void offerId;
    return ok([
      { label: "Podpora 3 mesece", unitPrice: 900 },
      { label: "Integracija e-pošte", unitPrice: 1500 },
    ]);
  }

  compareRevisions(offerId: string, access: OfferAccess = systemOfferAccess): Result<string> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    const revisions = offerRevisionRepository.getByOfferId(offerId);
    if (revisions.length < 2) return ok("Ni dovolj revizij za primerjavo.");
    const last = revisions[revisions.length - 1];
    const prev = revisions[revisions.length - 2];
    return ok(`R${prev.revisionNumber}: ${prev.changeSummary} → R${last.revisionNumber}: ${last.changeSummary}`);
  }
}

export const offerDraftService = new OfferDraftService();

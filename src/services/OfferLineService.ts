import { offerLineRepository } from "@/src/repositories/OfferLineRepository";
import { offerRepository } from "@/src/repositories/OfferRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Offer, OfferLine } from "@/src/domain/offers";
import type { OfferLineWrite } from "@/src/types/offers";
import { recordOfferAudit } from "./offerAudit";
import { systemOfferAccess, type OfferAccess } from "./offerAccess";
import { nextCrmId, stampCrm } from "./crmStamp";

export function computeLineTotal(quantity: number, unitPrice: number, taxRate: number): number {
  return Math.round(quantity * unitPrice * (1 + taxRate / 100) * 100) / 100;
}

export function computeOfferTotals(lines: OfferLine[]): { subtotal: number; tax: number; total: number } {
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const tax = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice * (line.taxRate / 100), 0);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round((subtotal + tax) * 100) / 100,
  };
}

export function applyTotals(offer: Offer, lines: OfferLine[]): Offer {
  const totals = computeOfferTotals(lines);
  return {
    ...offer,
    ...totals,
    updatedAt: new Date().toISOString(),
    version: (offer.version ?? 1) + 1,
  };
}

export class OfferLineService {
  listByOffer(offerId: string, access: OfferAccess = systemOfferAccess): Result<OfferLine[]> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    return ok(offerLineRepository.getByOfferId(offerId).sort((a, b) => a.sortOrder - b.sortOrder));
  }

  add(input: OfferLineWrite, access: OfferAccess = systemOfferAccess): Result<OfferLine> {
    if (!access.write) return err("Ni dovoljenja za zapis ponudbe.");
    if (!input.label.trim()) return err("Postavka potrebuje naziv.");
    const offer = offerRepository.getById(input.offerId);
    if (!offer) return err("Ponudba ne obstaja.");
    const taxRate = input.taxRate ?? 22;
    const line = stampCrm<OfferLine>(nextCrmId("ol", offerLineRepository.count()), "active", {
      offerId: input.offerId,
      label: input.label.trim(),
      description: input.description,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      taxRate,
      total: computeLineTotal(input.quantity, input.unitPrice, taxRate),
      sortOrder: input.sortOrder ?? offerLineRepository.getByOfferId(input.offerId).length + 1,
    });
    offerLineRepository.create(line);
    offerRepository.update(applyTotals(offer, offerLineRepository.getByOfferId(input.offerId)));
    recordOfferAudit("OfferUpdated", { id: offer.id, lineId: line.id });
    return ok(line);
  }

  archive(id: string, access: OfferAccess = systemOfferAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const line = offerLineRepository.getById(id);
    const done = offerLineRepository.archive(id);
    if (line) {
      const offer = offerRepository.getById(line.offerId);
      if (offer) offerRepository.update(applyTotals(offer, offerLineRepository.getByOfferId(line.offerId)));
    }
    return ok(done);
  }
}

export const offerLineService = new OfferLineService();

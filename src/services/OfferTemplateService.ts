import { offerTemplateRepository } from "@/src/repositories/OfferTemplateRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { OfferTemplate } from "@/src/domain/offers";
import type { OfferListResult, OfferQueryParams } from "@/src/types/offers";
import { systemOfferAccess, type OfferAccess } from "./offerAccess";
import { nextCrmId, stampCrm } from "./crmStamp";

export class OfferTemplateService {
  list(params: OfferQueryParams = {}, access: OfferAccess = systemOfferAccess): Result<OfferListResult<OfferTemplate>> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    try {
      return ok(offerTemplateRepository.list(params));
    } catch {
      return err("Predlog ni bilo mogoče naložiti.");
    }
  }

  getById(id: string, access: OfferAccess = systemOfferAccess): Result<OfferTemplate> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    const item = offerTemplateRepository.getById(id);
    if (!item) return err("Predloga ne obstaja.");
    return ok(item);
  }

  create(name: string, title: string, access: OfferAccess = systemOfferAccess): Result<OfferTemplate> {
    if (!access.write) return err("Ni dovoljenja za zapis ponudbe.");
    if (!name.trim()) return err("Ime predloge je obvezno.");
    const item = stampCrm<OfferTemplate>(nextCrmId("ot", offerTemplateRepository.count()), "active", {
      name: name.trim(),
      title: title.trim() || name.trim(),
      currency: "EUR",
      defaultTaxRate: 22,
      notes: "Standardna predloga JU-TAN.",
    });
    return ok(offerTemplateRepository.create(item));
  }
}

export const offerTemplateService = new OfferTemplateService();

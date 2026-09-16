import type { OfferLine } from "@/src/domain/offers";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class OfferLineRepository extends CrmRepository<OfferLine> {
  constructor() {
    super("offer_lines", appPersistence.repositories.offerLines);
  }
}

export const offerLineRepository = new OfferLineRepository();

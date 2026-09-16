import type { Offer } from "@/src/domain/offers";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class OfferRepository extends CrmRepository<Offer> {
  constructor() {
    super("offers", appPersistence.repositories.offers);
  }

  getTimelineByOfferId(offerId: string) {
    return appPersistence.repositories.offerStatusHistory.list({ filter: { offerId } });
  }

  getApprovalsByOfferId(offerId: string) {
    return appPersistence.repositories.offerApprovals.list({ filter: { offerId } });
  }

  getRevisionsByOfferId(offerId: string) {
    return appPersistence.repositories.offerRevisions.list({ filter: { offerId } });
  }
}

export const offerRepository = new OfferRepository();

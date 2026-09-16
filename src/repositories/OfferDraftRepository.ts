import type { OfferDraft } from "@/src/domain/offers";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class OfferDraftRepository extends CrmRepository<OfferDraft> {
  constructor() {
    super("offer_drafts", appPersistence.repositories.offerDrafts);
  }
}

export const offerDraftRepository = new OfferDraftRepository();

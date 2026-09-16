import type { OfferRevision } from "@/src/domain/offers";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class OfferRevisionRepository extends CrmRepository<OfferRevision> {
  constructor() {
    super("offer_revisions", appPersistence.repositories.offerRevisions);
  }
}

export const offerRevisionRepository = new OfferRevisionRepository();

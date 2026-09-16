import type { OfferTemplate } from "@/src/domain/offers";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class OfferTemplateRepository extends CrmRepository<OfferTemplate> {
  constructor() {
    super("offer_templates", appPersistence.repositories.offerTemplates);
  }
}

export const offerTemplateRepository = new OfferTemplateRepository();

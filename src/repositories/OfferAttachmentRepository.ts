import type { OfferAttachment } from "@/src/domain/offers";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class OfferAttachmentRepository extends CrmRepository<OfferAttachment> {
  constructor() {
    super("offer_attachments", appPersistence.repositories.offerAttachments);
  }
}

export const offerAttachmentRepository = new OfferAttachmentRepository();

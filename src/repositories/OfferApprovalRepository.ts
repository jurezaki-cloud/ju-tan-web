import type { OfferApproval } from "@/src/domain/offers";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class OfferApprovalRepository extends CrmRepository<OfferApproval> {
  constructor() {
    super("offer_approvals", appPersistence.repositories.offerApprovals);
  }
}

export const offerApprovalRepository = new OfferApprovalRepository();

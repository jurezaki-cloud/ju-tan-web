import { ApprovalEngine } from "@/src/ai/approval/ApprovalEngine";
import { DefaultApprovalPolicy } from "@/src/ai/approval/policy";
import { InMemoryApprovalStore } from "@/src/ai/approval/store";
import { offerApprovalRepository } from "@/src/repositories/OfferApprovalRepository";
import { offerRepository } from "@/src/repositories/OfferRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Offer, OfferApproval } from "@/src/domain/offers";
import type { OfferApprovalWrite } from "@/src/types/offers";
import { recordOfferAudit } from "./offerAudit";
import { systemOfferAccess, type OfferAccess } from "./offerAccess";
import { nextCrmId, stampCrm } from "./crmStamp";
import { pushStatus } from "./offerStatus";

export function createOfferApprovalEngine(): ApprovalEngine {
  return new ApprovalEngine(new InMemoryApprovalStore(), new DefaultApprovalPolicy());
}

export class OfferApprovalService {
  constructor(private readonly engine = createOfferApprovalEngine()) {}

  listByOffer(offerId: string, access: OfferAccess = systemOfferAccess): Result<OfferApproval[]> {
    if (!access.read) return err("Ni dovoljenja za branje ponudb.");
    return ok(offerApprovalRepository.getByOfferId(offerId));
  }

  async request(input: OfferApprovalWrite, access: OfferAccess = systemOfferAccess): Promise<Result<OfferApproval>> {
    if (!access.write && !access.approve) return err("Ni dovoljenja za zahtevo odobritve.");
    const offer = offerRepository.getById(input.offerId);
    if (!offer) return err("Ponudba ne obstaja.");
    const engine = await this.engine.request({
      actionId: `offer:${offer.id}`,
      title: `Odobritev ${offer.number}`,
      description: input.comment ?? offer.title,
    });
    const row = stampCrm<OfferApproval>(nextCrmId("oa", offerApprovalRepository.count()), "WaitingApproval", {
      offerId: offer.id,
      decision: "pending",
      comment: input.comment,
      engineApprovalId: engine.id,
    });
    offerApprovalRepository.create(row);
    offerRepository.update(pushStatus(offer, "WaitingApproval"));
    recordOfferAudit("OfferApprovalRequested", { id: offer.id, approvalId: row.id });
    return ok(row);
  }

  async grant(offerId: string, access: OfferAccess = systemOfferAccess, comment?: string): Promise<Result<Offer>> {
    if (!access.approve) return err("Ni dovoljenja za odobritev ponudbe.");
    const offer = offerRepository.getById(offerId);
    if (!offer) return err("Ponudba ne obstaja.");
    const pending = offerApprovalRepository.getByOfferId(offerId).find((item) => item.decision === "pending");
    if (pending?.engineApprovalId) {
      await this.engine.grant(pending.engineApprovalId, access.userId);
      offerApprovalRepository.update({
        ...pending,
        decision: "granted",
        approvedBy: access.userId,
        approvedAt: new Date().toISOString(),
        comment: comment ?? pending.comment,
        updatedAt: new Date().toISOString(),
        version: (pending.version ?? 1) + 1,
      });
    }
    const next = pushStatus(offer, "Approved", { approvedAt: new Date().toISOString() });
    offerRepository.update(next);
    recordOfferAudit("OfferApprovalGranted", { id: offer.id });
    return ok(next);
  }

  reject(offerId: string, access: OfferAccess = systemOfferAccess, comment?: string): Result<Offer> {
    if (!access.approve) return err("Ni dovoljenja za zavrnitev ponudbe.");
    const offer = offerRepository.getById(offerId);
    if (!offer) return err("Ponudba ne obstaja.");
    const pending = offerApprovalRepository.getByOfferId(offerId).find((item) => item.decision === "pending");
    if (pending) {
      offerApprovalRepository.update({
        ...pending,
        decision: "rejected",
        comment,
        updatedAt: new Date().toISOString(),
        version: (pending.version ?? 1) + 1,
      });
    }
    const next = pushStatus(offer, "Rejected", { rejectedAt: new Date().toISOString() });
    offerRepository.update(next);
    recordOfferAudit("OfferApprovalRejected", { id: offer.id });
    return ok(next);
  }
}

export const offerApprovalService = new OfferApprovalService();

import type { Offer, OfferStatus, OfferStatusHistory } from "@/src/domain/offers";
import { appPersistence } from "@/src/persistence/app";
import { nextCrmId, stampCrm } from "./crmStamp";

export function pushStatus(offer: Offer, status: OfferStatus, extra: Partial<Offer> = {}): Offer {
  const history = stampCrm<OfferStatusHistory>(nextCrmId("oh", Date.now() % 10000), status, {
    offerId: offer.id,
    fromStatus: offer.status,
    toStatus: status,
  });
  appPersistence.repositories.offerStatusHistory.save(history);
  return {
    ...offer,
    ...extra,
    status,
    updatedAt: new Date().toISOString(),
    version: (offer.version ?? 1) + 1,
  };
}

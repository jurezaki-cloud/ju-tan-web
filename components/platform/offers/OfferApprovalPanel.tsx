import FormField from "@/components/platform/FormField";
import FormActions from "@/components/platform/FormActions";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import {
  grantOfferApprovalAction,
  rejectOfferApprovalAction,
  requestOfferApprovalAction,
} from "@/src/services/offerActions";
import type { Offer, OfferApproval } from "@/src/domain/offers";
import { cardBodyClass, ctaBase, ctaSizes, ctaVariants, fieldClass, metaClass } from "@/design";
import { cn } from "@/lib/utils";

export default function OfferApprovalPanel({ offer, approvals }: { offer: Offer; approvals: OfferApproval[] }) {
  return (
    <div className="space-y-4">
      <StatusBadge label={offer.status} tone={statusTone(offer.status)} />
      <ul className="space-y-2">
        {approvals.length === 0 ? (
          <li className={metaClass}>Ni zahtev za odobritev.</li>
        ) : (
          approvals.map((item) => (
            <li key={item.id} className={cardBodyClass}>
              {item.decision} · {item.comment ?? "—"} · {item.approvedBy ?? "čaka"}
            </li>
          ))
        )}
      </ul>
      <form action={requestOfferApprovalAction} className="space-y-3">
        <input type="hidden" name="offerId" value={offer.id} />
        <FormField id="comment" label="Komentar">
          <textarea id="comment" name="comment" className={fieldClass} rows={3} />
        </FormField>
        <FormActions>
          <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
            Zahtevaj odobritev
          </button>
        </FormActions>
      </form>
      <form action={grantOfferApprovalAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="offerId" value={offer.id} />
        <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
          Odobri
        </button>
      </form>
      <form action={rejectOfferApprovalAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="offerId" value={offer.id} />
        <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.ghost)}>
          Zavrni
        </button>
      </form>
      <p className={metaClass}>Pošiljanje e-pošte je dovoljeno šele po odobritvi (Offer.Send).</p>
    </div>
  );
}

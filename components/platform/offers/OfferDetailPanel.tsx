import Link from "next/link";
import SectionCard from "@/components/platform/SectionCard";
import FormField from "@/components/platform/FormField";
import FormSection from "@/components/platform/FormSection";
import FormActions from "@/components/platform/FormActions";
import { updateOfferAction } from "@/src/services/offerActions";
import type { Offer } from "@/src/domain/offers";
import { ctaBase, ctaSizes, ctaVariants, fieldClass, metaClass, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";

export default function OfferDetailPanel({ offer }: { offer: Offer }) {
  return (
    <SectionCard title="Podatki">
      <form action={updateOfferAction} className="space-y-3">
        <input type="hidden" name="id" value={offer.id} />
        <FormSection title="Osnovno">
          <FormField id="title" label="Naziv">
            <input id="title" name="title" className={fieldClass} defaultValue={offer.title} />
          </FormField>
          <FormField id="clientId" label="Stranka">
            <input id="clientId" name="clientId" className={fieldClass} defaultValue={offer.clientId ?? ""} />
          </FormField>
          <FormField id="leadId" label="Lead">
            <input id="leadId" name="leadId" className={fieldClass} defaultValue={offer.leadId ?? ""} />
          </FormField>
          <FormField id="projectId" label="Projekt">
            <input id="projectId" name="projectId" className={fieldClass} defaultValue={offer.projectId ?? ""} />
          </FormField>
          <FormField id="validUntil" label="Veljavno do">
            <input id="validUntil" name="validUntil" type="date" className={fieldClass} defaultValue={offer.validUntil ?? ""} />
          </FormField>
          <FormField id="currency" label="Valuta">
            <input id="currency" name="currency" className={fieldClass} defaultValue={offer.currency} />
          </FormField>
        </FormSection>
        <p className={metaClass}>
          Neto {offer.subtotal} · DDV {offer.tax} · Skupaj {offer.total} {offer.currency}
        </p>
        <FormActions>
          <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
            Shrani
          </button>
        </FormActions>
      </form>
      <div className="mt-4 flex flex-wrap gap-3">
        {offer.clientId ? (
          <Link href={`/clients/${offer.clientId}`} className={textLinkClass}>
            Stranka
          </Link>
        ) : null}
        {offer.leadId ? (
          <Link href={`/crm/leads/${offer.leadId}`} className={textLinkClass}>
            Lead
          </Link>
        ) : null}
        {offer.documentId ? (
          <Link href="/documents" className={textLinkClass}>
            Dokument
          </Link>
        ) : null}
        {offer.pdfArtifactId ? <span className={metaClass}>PDF {offer.pdfArtifactId}</span> : null}
      </div>
    </SectionCard>
  );
}

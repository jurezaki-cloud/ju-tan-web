import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import OfferDraftPanel from "@/components/platform/offers/OfferDraftPanel";
import OfferLineEditor from "@/components/platform/offers/OfferLineEditor";
import FormField from "@/components/platform/FormField";
import FormActions from "@/components/platform/FormActions";
import { offerService } from "@/src/services/OfferService";
import { offerDraftService } from "@/src/services/OfferDraftService";
import { offerLineService } from "@/src/services/OfferLineService";
import { reviseOfferAction } from "@/src/services/offerActions";
import { ctaBase, ctaSizes, ctaVariants, fieldClass, textLinkClass, cardBodyClass } from "@/design";
import { cn } from "@/lib/utils";
import SectionCard from "@/components/platform/SectionCard";

export default async function OfferDraftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = offerService.getById(id);
  if (!result.ok) notFound();
  const draft = offerDraftService.getByOffer(id);
  const lines = offerLineService.listByOffer(id);
  const compare = offerDraftService.compareRevisions(id);
  const suggestions = offerDraftService.suggestLines(id);
  return (
    <>
      <PageHeader
        title={`Osnutek ${result.data.number}`}
        description="AI pregled pred odobritvijo."
        actions={
          <Link href={`/crm/offers/${id}`} className={textLinkClass}>
            Nazaj
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OfferDraftPanel draft={draft.ok ? draft.data : undefined} />
        <SectionCard title="Postavke">
          <OfferLineEditor offerId={id} lines={lines.ok ? lines.data : []} />
        </SectionCard>
        <SectionCard title="Predlogi postavk">
          <ul className="space-y-2">
            {suggestions.ok
              ? suggestions.data.map((item) => (
                  <li key={item.label} className={cardBodyClass}>
                    {item.label} · {item.unitPrice} EUR
                  </li>
                ))
              : null}
          </ul>
        </SectionCard>
        <SectionCard title="Primerjava revizij">
          <p className={cardBodyClass}>{compare.ok ? compare.data : ""}</p>
          <form action={reviseOfferAction} className="mt-4 space-y-3">
            <input type="hidden" name="offerId" value={id} />
            <FormField id="changeSummary" label="Povzetek spremembe">
              <input id="changeSummary" name="changeSummary" className={fieldClass} required />
            </FormField>
            <FormActions>
              <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
                Nova revizija
              </button>
            </FormActions>
          </form>
        </SectionCard>
      </div>
    </>
  );
}

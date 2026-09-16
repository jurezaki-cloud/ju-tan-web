import FormField from "@/components/platform/FormField";
import FormSection from "@/components/platform/FormSection";
import FormActions from "@/components/platform/FormActions";
import { addOfferLineAction } from "@/src/services/offerActions";
import type { OfferLine } from "@/src/domain/offers";
import { cardBodyClass, ctaBase, ctaSizes, ctaVariants, fieldClass, metaClass } from "@/design";
import { cn } from "@/lib/utils";

export default function OfferLineEditor({ offerId, lines }: { offerId: string; lines: OfferLine[] }) {
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {lines.length === 0 ? (
          <li className={metaClass}>Ni postavk.</li>
        ) : (
          lines.map((line) => (
            <li key={line.id} className={cardBodyClass}>
              {line.sortOrder}. {line.label} · {line.quantity} × {line.unitPrice} · {line.total}
            </li>
          ))
        )}
      </ul>
      <form action={addOfferLineAction} className="space-y-3">
        <input type="hidden" name="offerId" value={offerId} />
        <FormSection title="Nova postavka">
          <FormField id="label" label="Naziv">
            <input id="label" name="label" className={fieldClass} required />
          </FormField>
          <FormField id="quantity" label="Količina">
            <input id="quantity" name="quantity" type="number" step="0.01" defaultValue="1" className={fieldClass} />
          </FormField>
          <FormField id="unitPrice" label="Cena">
            <input id="unitPrice" name="unitPrice" type="number" step="0.01" defaultValue="0" className={fieldClass} />
          </FormField>
          <FormField id="taxRate" label="DDV %">
            <input id="taxRate" name="taxRate" type="number" step="0.01" defaultValue="22" className={fieldClass} />
          </FormField>
        </FormSection>
        <FormActions>
          <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
            Dodaj postavko
          </button>
        </FormActions>
      </form>
    </div>
  );
}

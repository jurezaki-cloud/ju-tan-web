import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import { OfferRevisionsTable } from "@/components/platform/crm/CrmTypedTables";
import { offerService } from "@/src/services/OfferService";
import { offerRevisionRepository } from "@/src/repositories/OfferRevisionRepository";
import { textLinkClass } from "@/design";

export default async function OfferRevisionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = offerService.getById(id);
  if (!result.ok) notFound();
  const items = offerRevisionRepository.getByOfferId(id);
  const status = items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title={`Revizije ${result.data.number}`}
        actions={
          <Link href={`/crm/offers/${id}/draft`} className={textLinkClass}>
            Osnutek
          </Link>
        }
      />
      <PageState status={status} emptyTitle="Ni revizij" emptyDescription="Ustvarite revizijo v osnutku.">
        {items.length > 0 ? <OfferRevisionsTable rows={items} /> : null}
      </PageState>
    </>
  );
}

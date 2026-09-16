import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import OfferApprovalPanel from "@/components/platform/offers/OfferApprovalPanel";
import { OfferApprovalsTable } from "@/components/platform/crm/CrmTypedTables";
import { offerService } from "@/src/services/OfferService";
import { offerApprovalService } from "@/src/services/OfferApprovalService";
import { textLinkClass } from "@/design";

export default async function OfferApprovePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = offerService.getById(id);
  if (!result.ok) notFound();
  const approvals = offerApprovalService.listByOffer(id);
  const items = approvals.ok ? approvals.data : [];
  const status = !approvals.ok ? "error" : items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title={`Odobritev ${result.data.number}`}
        description="Approval Engine: draft je dovoljen, send je gated."
        actions={
          <Link href={`/crm/offers/${id}`} className={textLinkClass}>
            Nazaj
          </Link>
        }
      />
      <div className="mb-6">
        <OfferApprovalPanel offer={result.data} approvals={items} />
      </div>
      <PageState status={status} emptyTitle="Ni odobritev" emptyDescription="Zahtevajte odobritev zgoraj." errorDescription={approvals.ok ? undefined : approvals.error}>
        {approvals.ok && items.length > 0 ? <OfferApprovalsTable rows={items} /> : null}
      </PageState>
    </>
  );
}

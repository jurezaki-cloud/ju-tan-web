import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import SectionCard from "@/components/platform/SectionCard";
import OfferDetailPanel from "@/components/platform/offers/OfferDetailPanel";
import OfferDraftPanel from "@/components/platform/offers/OfferDraftPanel";
import OfferLineEditor from "@/components/platform/offers/OfferLineEditor";
import OfferSummaryCard from "@/components/platform/offers/OfferSummaryCard";
import OfferRevisionList from "@/components/platform/offers/OfferRevisionList";
import OfferFlowControls from "@/components/platform/offers/OfferFlowControls";
import CRMTimeline from "@/components/platform/crm/CRMTimeline";
import { offerService } from "@/src/services/OfferService";
import { offerLineService } from "@/src/services/OfferLineService";
import { offerDraftService } from "@/src/services/OfferDraftService";
import { offerApprovalService } from "@/src/services/OfferApprovalService";
import { offerRevisionRepository } from "@/src/repositories/OfferRevisionRepository";
import { activityService } from "@/src/services/ActivityService";
import { documentService } from "@/src/services/DocumentService";
import { generateOfferPdfAction, prepareOfferEmailAction } from "@/src/services/offerActions";
import { cardBodyClass, ctaBase, ctaSizes, ctaVariants, metaClass, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = offerService.getById(id);
  if (!result.ok) notFound();
  const offer = result.data;
  const lines = offerLineService.listByOffer(id);
  const draft = offerDraftService.getByOffer(id);
  const approvals = offerApprovalService.listByOffer(id);
  const timeline = offerService.timeline(id);
  const summary = offerService.summary(id);
  const activities = offer.clientId ? activityService.getByClientId(offer.clientId) : { ok: true as const, data: [] };
  const documents = offer.clientId ? documentService.listByClient(offer.clientId) : { ok: true as const, data: [] as { id: string; name: string }[] };
  const revisions = offerRevisionRepository.getByOfferId(id);

  return (
    <>
      <PageHeader
        title={offer.title}
        description={`${offer.number} · ${offer.status}`}
        actions={
          <>
            <Link href="/crm/offers" className={textLinkClass}>
              Seznam
            </Link>
            <Link href={`/crm/offers/${id}/draft`} className={textLinkClass}>
              Osnutek
            </Link>
            <Link href={`/crm/offers/${id}/approve`} className={textLinkClass}>
              Odobritev
            </Link>
            <Link href={`/crm/offers/${id}/revisions`} className={textLinkClass}>
              Revizije
            </Link>
            <Link href={`/crm/offers/${id}/timeline`} className={textLinkClass}>
              Časovnica
            </Link>
            <OfferFlowControls offerId={id} title={offer.title} canSend={offer.status === "Approved"} />
          </>
        }
      />
      <PageState status="ready">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <OfferSummaryCard offer={offer} />
          <OfferDetailPanel offer={offer} />
          <SectionCard title="Postavke in izračun">
            <OfferLineEditor offerId={id} lines={lines.ok ? lines.data : []} />
          </SectionCard>
          <OfferDraftPanel draft={draft.ok ? draft.data : undefined} />
          <SectionCard title="Odobritev">
            <p className={cardBodyClass}>
              {approvals.ok && approvals.data.length > 0
                ? approvals.data.map((item) => item.decision).join(", ")
                : "Ni zahteve."}
            </p>
          </SectionCard>
          <SectionCard title="Revizije">
            <OfferRevisionList revisions={revisions} />
          </SectionCard>
          <SectionCard title="Aktivnosti">
            {!activities.ok || activities.data.length === 0 ? (
              <p className={metaClass}>Ni povezanih aktivnosti.</p>
            ) : (
              <ul className="space-y-2">
                {activities.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>
                    {item.subject ?? item.name}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
          <SectionCard title="Dokumenti in artifact">
            <p className={metaClass}>
              PDF: {offer.pdfArtifactId ?? "ni"} · dokument: {offer.documentId ?? "ni"}
            </p>
            {!documents.ok || documents.data.length === 0 ? (
              <p className={`mt-2 ${metaClass}`}>Ni povezanih dokumentov stranke.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {documents.data.map((doc) => (
                  <li key={doc.id} className={cardBodyClass}>
                    {doc.name}
                  </li>
                ))}
              </ul>
            )}
            <form action={generateOfferPdfAction} className="mt-3">
              <input type="hidden" name="offerId" value={id} />
              <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
                Generiraj PDF
              </button>
            </form>
            <form action={prepareOfferEmailAction} className="mt-2">
              <input type="hidden" name="offerId" value={id} />
              <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.ghost)}>
                Osnutek e-pošte
              </button>
            </form>
            {offer.emailDraft ? <pre className={`mt-3 whitespace-pre-wrap ${cardBodyClass}`}>{offer.emailDraft}</pre> : null}
          </SectionCard>
          <SectionCard title="AI povzetek">
            <p className={cardBodyClass}>{summary.ok ? summary.data : ""}</p>
          </SectionCard>
          <SectionCard title="Časovnica">
            {timeline.ok ? (
              <CRMTimeline
                entries={timeline.data.map((item) => ({
                  id: item.id,
                  at: item.at,
                  kind: "audit",
                  title: item.title,
                  subtitle: item.subtitle,
                }))}
              />
            ) : (
              <p className={metaClass}>Ni dogodkov.</p>
            )}
          </SectionCard>
        </div>
      </PageState>
    </>
  );
}

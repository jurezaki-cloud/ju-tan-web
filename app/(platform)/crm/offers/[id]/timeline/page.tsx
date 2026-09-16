import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import CRMTimeline from "@/components/platform/crm/CRMTimeline";
import { offerService } from "@/src/services/OfferService";
import { textLinkClass } from "@/design";

export default async function OfferTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = offerService.getById(id);
  if (!result.ok) notFound();
  const timeline = offerService.timeline(id);
  const entries = timeline.ok ? timeline.data : [];
  const status = !timeline.ok ? "error" : entries.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title={`Časovnica ${result.data.number}`}
        actions={
          <Link href={`/crm/offers/${id}`} className={textLinkClass}>
            Ponudba
          </Link>
        }
      />
      <PageState status={status} emptyTitle="Ni dogodkov" emptyDescription="Časovnica je prazna." errorDescription={timeline.ok ? undefined : timeline.error}>
        {timeline.ok ? (
          <CRMTimeline
            entries={entries.map((item) => ({
              id: item.id,
              at: item.at,
              kind: "audit",
              title: item.title,
              subtitle: item.subtitle ?? item.kind,
            }))}
          />
        ) : null}
      </PageState>
    </>
  );
}

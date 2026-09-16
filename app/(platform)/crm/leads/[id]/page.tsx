import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import SectionCard from "@/components/platform/SectionCard";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import CRMTimeline from "@/components/platform/crm/CRMTimeline";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { leadService } from "@/src/services/LeadService";
import { activityService } from "@/src/services/ActivityService";
import { crmService } from "@/src/services/CRMService";
import { documentService } from "@/src/services/DocumentService";
import { updateLeadAction, createActivityAction } from "@/src/services/crmActions";
import { createOfferAction } from "@/src/services/offerActions";
import { offerService } from "@/src/services/OfferService";
import { cardBodyClass, fieldClass, metaClass, textLinkClass, ctaBase, ctaSizes, ctaVariants } from "@/design";
import { cn } from "@/lib/utils";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = leadService.getById(id);
  if (!result.ok) notFound();
  const lead = result.data;
  const activities = lead.companyId ? activityService.getByClientId(lead.companyId) : { ok: true as const, data: [] };
  const timeline = lead.companyId ? crmService.timeline(lead.companyId) : { ok: true as const, data: [] };
  const summary = lead.companyId ? crmService.summarizeTimeline(lead.companyId) : { ok: true as const, data: "Ni stranke." };
  const documents = lead.companyId ? documentService.listByClient(lead.companyId) : { ok: true as const, data: [] as { id: string; name: string }[] };
  const offers = offerService.getByLeadId(lead.id);

  return (
    <>
      <PageHeader
        title={lead.name}
        description={`${lead.company} · ${lead.status}`}
        actions={<Link href="/crm/leads" className={textLinkClass}>Nazaj</Link>}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Lead">
          <form action={updateLeadAction} className="space-y-3">
            <input type="hidden" name="id" value={lead.id} />
            <input className={fieldClass} name="name" defaultValue={lead.name} />
            <input className={fieldClass} name="company" defaultValue={lead.company} />
            <input className={fieldClass} name="status" defaultValue={lead.status} />
            <input className={fieldClass} name="email" defaultValue={lead.email} />
            <input className={fieldClass} name="phone" defaultValue={lead.phone} />
            <input className={fieldClass} name="clientId" defaultValue={lead.companyId} />
            <p className={metaClass}>Lastnik / vir / ocena se hranijo v persistence metapodatkih.</p>
            <StatusBadge label={lead.status} tone={statusTone(lead.status)} />
            <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>Shrani</button>
          </form>
        </SectionCard>
        <SectionCard title="Aktivnosti">
          <CRMEntityForm title="Aktivnost" triggerLabel="Dodaj" action={createActivityAction} hidden={{ clientId: lead.companyId }} fields={[
            { name: "subject", label: "Zadeva", required: true },
          ]} />
          <ul className="mt-3 space-y-2">
            {activities.ok
              ? activities.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>{item.subject ?? item.name}</li>
                ))
              : null}
          </ul>
        </SectionCard>
        <SectionCard title="Dokumenti">
          {!documents.ok || documents.data.length === 0 ? (
            <p className={metaClass}>Ni povezanih dokumentov.</p>
          ) : (
            <ul className="space-y-2">
              {documents.data.map((doc) => (
                <li key={doc.id} className={cardBodyClass}>{doc.name}</li>
              ))}
            </ul>
          )}
        </SectionCard>
        <SectionCard title="Povezane ponudbe">
          <CRMEntityForm
            title="Osnutek ponudbe"
            triggerLabel="AI osnutek"
            action={createOfferAction}
            hidden={{ leadId: lead.id, clientId: lead.companyId }}
            fields={[{ name: "title", label: "Naziv" }, { name: "notes", label: "Opombe", type: "textarea" }]}
          />
          <ul className="mt-3 space-y-2">
            {!offers.ok || offers.data.length === 0 ? (
              <li className={metaClass}>Ni povezane ponudbe.</li>
            ) : (
              offers.data.map((item) => (
                <li key={item.id} className={cardBodyClass}>
                  <Link href={`/crm/offers/${item.id}`} className={textLinkClass}>
                    {item.number} · {item.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </SectionCard>
        <SectionCard title="AI povzetek">
          <p className={cardBodyClass}>{summary.ok ? summary.data : ""}</p>
          {timeline.ok ? <div className="mt-4"><CRMTimeline entries={timeline.data} /></div> : null}
        </SectionCard>
      </div>
    </>
  );
}

import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import StatsCard from "@/components/platform/StatsCard";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import OfferListToolbar from "@/components/platform/offers/OfferListToolbar";
import { OffersTable } from "@/components/platform/crm/CrmTypedTables";
import { offerService } from "@/src/services/OfferService";
import { offerTemplateService } from "@/src/services/OfferTemplateService";
import { createOfferAction } from "@/src/services/offerActions";
import { FileText, CheckCircle2, Clock } from "lucide-react";
import { textLinkClass } from "@/design";

export default async function CrmOffersPage() {
  const result = offerService.list();
  const templates = offerTemplateService.list();
  const items = result.ok ? result.data.items : [];
  const approved = items.filter((item) => item.status === "Approved" || item.status === "Sent").length;
  const waiting = items.filter((item) => item.status === "WaitingApproval" || item.status === "InReview").length;
  const status = !result.ok ? "error" : items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title="Ponudbe"
        description="Osnutek, AI pregled, odobritev, PDF artifact in pošiljanje."
        actions={
          <>
            <Link href="/crm/offers/templates" className={textLinkClass}>
              Predloge
            </Link>
            <Link href="/crm/offers/new" className={textLinkClass}>
              Nova
            </Link>
            <CRMEntityForm
              title="Nova ponudba"
              triggerLabel="Osnutek"
              action={createOfferAction}
              fields={[
                { name: "title", label: "Naziv" },
                { name: "clientId", label: "Id stranke" },
                { name: "leadId", label: "Id lead-a" },
                { name: "notes", label: "Opombe", type: "textarea" },
              ]}
            />
          </>
        }
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Ponudbe" value={String(result.ok ? result.data.total : 0)} icon={FileText} />
        <StatsCard label="V odobritvi" value={String(waiting)} icon={Clock} />
        <StatsCard label="Odobreno / poslano" value={String(approved)} icon={CheckCircle2} />
      </div>
      <div className="mb-4">
        <OfferListToolbar
          actions={
            <p className="text-[13px] text-slate-400">
              Predloge: {templates.ok ? templates.data.total : 0}
            </p>
          }
        />
      </div>
      <PageState status={status} emptyTitle="Ni ponudb" emptyDescription="Ustvarite osnutek iz lead-a ali stranke." errorDescription={result.ok ? undefined : result.error}>
        {result.ok ? <OffersTable rows={items} /> : null}
      </PageState>
    </>
  );
}

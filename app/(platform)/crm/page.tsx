import PageHeader from "@/components/platform/PageHeader";
import CrmTable from "@/components/platform/tables/CrmTable";
import PageState from "@/components/platform/PageState";
import StatsCard from "@/components/platform/StatsCard";
import CRMQuickActions from "@/components/platform/crm/CRMQuickActions";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { getLeads } from "@/src/api/crm";
import { clientService } from "@/src/services/ClientService";
import { opportunityService } from "@/src/services/OpportunityService";
import { taskService } from "@/src/services/TaskService";
import { quoteService } from "@/src/services/QuoteService";
import { crmService } from "@/src/services/CRMService";
import { createLeadAction } from "@/src/services/crmActions";
import { Users, Briefcase, ListTodo, FileText } from "lucide-react";
import { cardSurface, metaClass } from "@/design";
import Link from "next/link";

export default async function CrmPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const params = (await searchParams) ?? {};
  const result = await getLeads();
  const clients = clientService.list();
  const opportunities = opportunityService.list();
  const tasks = taskService.list();
  const quotes = quoteService.list();
  const search = params.q ? crmService.search(params.q) : undefined;
  const status = !result.ok ? "error" : result.data.length === 0 ? "empty" : "ready";

  return (
    <>
      <PageHeader
        title="CRM"
        description="Stiki, stranke, priložnosti in ponudbe. Iskanje, filtri in paginacija so lokalni."
        actions={<CRMEntityForm title="Nov lead" triggerLabel="Nov lead" action={createLeadAction} fields={[
          { name: "name", label: "Ime", required: true },
          { name: "company", label: "Podjetje", required: true },
          { name: "email", label: "E-pošta" },
          { name: "phone", label: "Telefon" },
          { name: "source", label: "Vir" },
        ]} />}
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Stranke" value={String(clients.ok ? clients.data.length : 0)} icon={Users} />
        <StatsCard label="Priložnosti" value={String(opportunities.ok ? opportunities.data.total : 0)} icon={Briefcase} />
        <StatsCard label="Naloge" value={String(tasks.ok ? tasks.data.total : 0)} icon={ListTodo} />
        <StatsCard label="Ponudbe" value={String(quotes.ok ? quotes.data.total : 0)} icon={FileText} />
      </div>
      <div className="mb-6">
        <CRMQuickActions />
      </div>
      <form className="mb-6" action="/crm">
        <label className="sr-only" htmlFor="crm-global-search">
          CRM iskanje
        </label>
        <input
          id="crm-global-search"
          name="q"
          defaultValue={params.q}
          placeholder="Išči stranke, leade, kontakte, naloge…"
          className="h-11 w-full max-w-md rounded-lg border border-white/10 bg-transparent px-3 text-[14px] text-white light:border-slate-200 light:text-slate-900"
        />
      </form>
      {search?.ok && params.q ? (
        <div className={`${cardSurface} mb-6 p-4`}>
          <p className={metaClass}>Zadetki</p>
          <ul className="mt-2 space-y-2">
            {search.data.map((hit) => (
              <li key={`${hit.type}-${hit.id}`}>
                <Link href={hit.route} className="text-[14px] text-[#16a34a]">
                  {hit.title}
                </Link>
                <span className={`ml-2 ${metaClass}`}>
                  {hit.type} · {hit.subtitle}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <PageState
        status={status}
        emptyTitle="Ni stikov"
        emptyDescription="CRM trenutno nima zapisov."
        errorDescription={result.ok ? undefined : result.error}
      >
        {result.ok ? <CrmTable rows={result.data} /> : null}
      </PageState>
    </>
  );
}

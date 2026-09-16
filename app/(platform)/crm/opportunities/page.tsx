import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { OpportunitiesTable } from "@/components/platform/crm/CrmTypedTables";
import { opportunityService } from "@/src/services/OpportunityService";
import { createOpportunityAction } from "@/src/services/crmActions";

export default async function CrmOpportunitiesPage() {
  const result = opportunityService.list();
  const items = result.ok ? result.data.items : [];
  const status = !result.ok ? "error" : items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title="Priložnosti"
        description="Opportunity pipeline."
        actions={
          <CRMEntityForm
            title="Nova priložnost"
            triggerLabel="Nova priložnost"
            action={createOpportunityAction}
            fields={[
              { name: "name", label: "Ime", required: true },
              { name: "clientId", label: "Id stranke" },
              { name: "amount", label: "Znesek" },
              { name: "stage", label: "Faza", defaultValue: "Kvalifikacija" },
              { name: "closeDate", label: "Datum", type: "date" },
            ]}
          />
        }
      />
      <PageState status={status} emptyTitle="Ni zapisov" emptyDescription="Seznam je prazen." errorDescription={result.ok ? undefined : result.error}>
        {result.ok ? <OpportunitiesTable rows={items} /> : null}
      </PageState>
    </>
  );
}

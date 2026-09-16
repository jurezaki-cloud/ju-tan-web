import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { ActivitiesTable } from "@/components/platform/crm/CrmTypedTables";
import { activityService } from "@/src/services/ActivityService";
import { createActivityAction } from "@/src/services/crmActions";

export default async function CrmActivitiesPage() {
  const result = activityService.list();
  const items = result.ok ? result.data.items : [];
  const status = !result.ok ? "error" : items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title="Aktivnosti"
        description="Klici, sestanki in opravila."
        actions={
          <CRMEntityForm
            title="Nova aktivnost"
            triggerLabel="Nova aktivnost"
            action={createActivityAction}
            fields={[
              { name: "subject", label: "Zadeva", required: true },
              { name: "type", label: "Tip", defaultValue: "call" },
              { name: "clientId", label: "Id stranke" },
            ]}
          />
        }
      />
      <PageState status={status} emptyTitle="Ni zapisov" emptyDescription="Seznam je prazen." errorDescription={result.ok ? undefined : result.error}>
        {result.ok ? <ActivitiesTable rows={items} /> : null}
      </PageState>
    </>
  );
}

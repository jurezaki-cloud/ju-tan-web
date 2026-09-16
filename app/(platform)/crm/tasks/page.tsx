import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { TasksTable } from "@/components/platform/crm/CrmTypedTables";
import { taskService } from "@/src/services/TaskService";
import { createTaskAction } from "@/src/services/crmActions";

export default async function CrmTasksPage() {
  const result = taskService.list();
  const items = result.ok ? result.data.items : [];
  const status = !result.ok ? "error" : items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title="Naloge"
        description="CRM naloge in roki."
        actions={
          <CRMEntityForm
            title="Nova naloga"
            triggerLabel="Nova naloga"
            action={createTaskAction}
            fields={[
              { name: "name", label: "Naloga", required: true },
              { name: "priority", label: "Prioriteta", defaultValue: "Srednja" },
              { name: "dueAt", label: "Rok", type: "date" },
              { name: "clientId", label: "Id stranke" },
            ]}
          />
        }
      />
      <PageState status={status} emptyTitle="Ni zapisov" emptyDescription="Seznam je prazen." errorDescription={result.ok ? undefined : result.error}>
        {result.ok ? <TasksTable rows={items} /> : null}
      </PageState>
    </>
  );
}

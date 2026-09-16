import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { NotesTable } from "@/components/platform/crm/CrmTypedTables";
import { noteService } from "@/src/services/NoteService";
import { createNoteAction } from "@/src/services/crmActions";

export default async function CrmNotesPage() {
  const result = noteService.list();
  const items = result.ok ? result.data.items : [];
  const status = !result.ok ? "error" : items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title="Opombe"
        description="CRM zapiski."
        actions={
          <CRMEntityForm
            title="Nova opomba"
            triggerLabel="Nova opomba"
            action={createNoteAction}
            fields={[
              { name: "body", label: "Besedilo", type: "textarea", required: true },
              { name: "clientId", label: "Id stranke" },
            ]}
          />
        }
      />
      <PageState status={status} emptyTitle="Ni zapisov" emptyDescription="Seznam je prazen." errorDescription={result.ok ? undefined : result.error}>
        {result.ok ? <NotesTable rows={items} /> : null}
      </PageState>
    </>
  );
}

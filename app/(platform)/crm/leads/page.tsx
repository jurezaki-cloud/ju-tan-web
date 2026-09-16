import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { LeadsTable } from "@/components/platform/crm/CrmTypedTables";
import { leadService } from "@/src/services/LeadService";
import { createLeadAction } from "@/src/services/crmActions";

export default async function CrmLeadsPage() {
  const result = leadService.list();
  const status = !result.ok ? "error" : result.data.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title="Leadi"
        description="Pipeline stikov in lastnikov."
        actions={
          <CRMEntityForm
            title="Nov lead"
            triggerLabel="Nov lead"
            action={createLeadAction}
            fields={[
              { name: "name", label: "Ime", required: true },
              { name: "company", label: "Podjetje", required: true },
              { name: "email", label: "E-pošta" },
              { name: "source", label: "Vir" },
              { name: "pipelineStage", label: "Faza" },
              { name: "expectedValue", label: "Vrednost" },
            ]}
          />
        }
      />
      <PageState status={status} emptyTitle="Ni zapisov" emptyDescription="Seznam je prazen." errorDescription={result.ok ? undefined : result.error}>
        {result.ok ? <LeadsTable rows={result.data} /> : null}
      </PageState>
    </>
  );
}

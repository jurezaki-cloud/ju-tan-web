import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { QuotesTable } from "@/components/platform/crm/CrmTypedTables";
import { quoteService } from "@/src/services/QuoteService";
import { createQuoteAction } from "@/src/services/crmActions";

export default async function CrmQuotesPage() {
  const result = quoteService.list();
  const items = result.ok ? result.data.items : [];
  const status = !result.ok ? "error" : items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title="Ponudbe"
        description="CRM quote osnutki in zneski."
        actions={
          <CRMEntityForm
            title="Nova ponudba"
            triggerLabel="Nova ponudba"
            action={createQuoteAction}
            fields={[
              { name: "title", label: "Naziv", required: true },
              { name: "amount", label: "Znesek" },
              { name: "currency", label: "Valuta", defaultValue: "EUR" },
              { name: "clientId", label: "Id stranke" },
            ]}
          />
        }
      />
      <PageState status={status} emptyTitle="Ni zapisov" emptyDescription="Seznam je prazen." errorDescription={result.ok ? undefined : result.error}>
        {result.ok ? <QuotesTable rows={items} /> : null}
      </PageState>
    </>
  );
}

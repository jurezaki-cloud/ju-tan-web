import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { OfferTemplatesTable } from "@/components/platform/crm/CrmTypedTables";
import { offerTemplateService } from "@/src/services/OfferTemplateService";
import { createOfferTemplateAction } from "@/src/services/offerActions";
import Link from "next/link";
import { textLinkClass } from "@/design";

export default async function OfferTemplatesPage() {
  const result = offerTemplateService.list();
  const items = result.ok ? result.data.items : [];
  const status = !result.ok ? "error" : items.length === 0 ? "empty" : "ready";
  return (
    <>
      <PageHeader
        title="Predloge ponudb"
        description="Standardne predloge za osnutke."
        actions={
          <>
            <Link href="/crm/offers" className={textLinkClass}>
              Ponudbe
            </Link>
            <CRMEntityForm
              title="Nova predloga"
              triggerLabel="Nova predloga"
              action={createOfferTemplateAction}
              fields={[
                { name: "name", label: "Ime", required: true },
                { name: "title", label: "Naziv" },
              ]}
            />
          </>
        }
      />
      <PageState status={status} emptyTitle="Ni predlog" emptyDescription="Dodajte prvo predlogo." errorDescription={result.ok ? undefined : result.error}>
        {result.ok ? <OfferTemplatesTable rows={items} /> : null}
      </PageState>
    </>
  );
}

import PageHeader from "@/components/platform/PageHeader";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { createOfferAction } from "@/src/services/offerActions";
import { textLinkClass } from "@/design";
import Link from "next/link";

export default function NewOfferPage() {
  return (
    <>
      <PageHeader
        title="Nova ponudba"
        description="Lead / stranka → AI osnutek."
        actions={
          <Link href="/crm/offers" className={textLinkClass}>
            Nazaj
          </Link>
        }
      />
      <CRMEntityForm
        title="Osnutek ponudbe"
        triggerLabel="Odpri obrazec"
        action={createOfferAction}
        fields={[
          { name: "title", label: "Naziv" },
          { name: "clientId", label: "Id stranke" },
          { name: "leadId", label: "Id lead-a" },
          { name: "opportunityId", label: "Id priložnosti" },
          { name: "notes", label: "Opombe", type: "textarea" },
        ]}
      />
    </>
  );
}

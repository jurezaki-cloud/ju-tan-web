import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import PageState from "@/components/platform/PageState";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { getClients } from "@/src/api/clients";
import { createClientAction } from "@/src/services/crmActions";
import { cardHover, cardSurface, headingCard, metaClass, cardBodyClass, focusRing } from "@/design";
import { cn } from "@/lib/utils";

export default async function ClientsPage() {
  const result = await getClients();
  const status = !result.ok ? "error" : result.data.length === 0 ? "empty" : "ready";

  return (
    <>
      <PageHeader
        title="Stranke"
        description="Kartice podjetij. Klik odpre profil s kontaktom, projekti, dokumenti in opombami."
        actions={
          <CRMEntityForm
            title="Nova stranka"
            triggerLabel="Nova stranka"
            action={createClientAction}
            fields={[
              { name: "name", label: "Podjetje", required: true },
              { name: "contactName", label: "Kontakt" },
              { name: "email", label: "E-pošta" },
              { name: "phone", label: "Telefon" },
              { name: "industry", label: "Panoga" },
              { name: "city", label: "Kraj" },
              { name: "website", label: "Splet" },
            ]}
          />
        }
      />
      <PageState
        status={status}
        emptyTitle="Ni strank"
        emptyDescription="Seznam strank je prazen."
        errorDescription={result.ok ? undefined : result.error}
      >
        {result.ok ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.data.map((client) => (
              <li key={client.id}>
                <Link
                  href={`/clients/${client.id}`}
                  className={cn(cardSurface, cardHover, focusRing, "block h-full p-6")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className={headingCard}>{client.name}</h2>
                    <StatusBadge label={client.status} tone={statusTone(client.status)} />
                  </div>
                  <p className={`mt-2 ${metaClass}`}>
                    {client.industry} · {client.city}
                  </p>
                  <p className={`mt-4 ${cardBodyClass}`}>{client.contactName}</p>
                  <p className={metaClass}>{client.email}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </PageState>
    </>
  );
}

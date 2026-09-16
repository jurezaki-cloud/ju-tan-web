import PageHeader from "@/components/platform/PageHeader";
import SectionCard from "@/components/platform/SectionCard";
import StatusBadge from "@/components/platform/StatusBadge";
import EmptyState from "@/components/platform/EmptyState";
import PageState from "@/components/platform/PageState";
import { getDocuments } from "@/src/api/documents";
import { platformConfig } from "@/src/config/platform";
import { metaClass } from "@/design";

export default async function DocumentsPage() {
  const result = await getDocuments();
  const status = !result.ok ? "error" : result.data.length === 0 ? "empty" : "ready";

  return (
    <>
      <PageHeader
        title="Dokumenti"
        description="Mape: pogodbe, ponudbe, PDF in specifikacije. Datoteke so demo zapisi."
      />
      <PageState
        status={status}
        emptyTitle="Ni dokumentov"
        emptyDescription="Mape so prazne."
        errorDescription={result.ok ? undefined : result.error}
      >
        {result.ok ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {platformConfig.documentFolders.map((folder) => {
              const items = result.data.filter((doc) => doc.folder === folder);
              return (
                <SectionCard key={folder} title={folder} description={`${items.length} datotek`}>
                  {items.length === 0 ? (
                    <EmptyState title="Prazna mapa" description="V tej mapi ni dokumentov." />
                  ) : (
                    <ul className="space-y-3">
                      {items.map((doc) => (
                        <li key={doc.id} className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[14px] text-white light:text-slate-900">
                              {doc.name}
                            </p>
                            <p className={metaClass}>
                              {doc.clientName} · {doc.updated}
                            </p>
                          </div>
                          <StatusBadge label={doc.kind} />
                        </li>
                      ))}
                    </ul>
                  )}
                </SectionCard>
              );
            })}
          </div>
        ) : null}
      </PageState>
    </>
  );
}

import PageHeader from "@/components/platform/PageHeader";
import SectionCard from "@/components/platform/SectionCard";
import PageState from "@/components/platform/PageState";
import PermissionGuard from "@/components/platform/auth/PermissionGuard";
import { Permission } from "@/src/config/permissions";
import { getDocuments, getOffers } from "@/src/api/documents";
import { metaClass } from "@/design";

export default async function PortalPage() {
  const [documents, offers] = await Promise.all([getDocuments(), getOffers()]);
  const failed = !documents.ok || !offers.ok;

  return (
    <PermissionGuard permission={Permission.Portal}>
      <PageHeader title="Portal" description="Dokumenti in ponudbe za stranko." />
      <PageState status={failed ? "error" : "ready"} errorDescription="Portala ni bilo mogoče naložiti.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard title="Dokumenti">
            {documents.ok ? (
              <ul className="space-y-3">
                {documents.data.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span className="text-[14px] text-slate-300 light:text-slate-700">{item.name}</span>
                    <span className={metaClass}>{item.kind}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </SectionCard>
          <SectionCard title="Ponudbe">
            {offers.ok ? (
              <ul className="space-y-3">
                {offers.data.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span className="text-[14px] text-slate-300 light:text-slate-700">{item.title}</span>
                    <span className={metaClass}>{item.amount}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </SectionCard>
        </div>
      </PageState>
    </PermissionGuard>
  );
}

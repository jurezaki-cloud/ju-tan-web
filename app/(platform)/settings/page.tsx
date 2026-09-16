import PageHeader from "@/components/platform/PageHeader";
import SectionCard from "@/components/platform/SectionCard";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import PageState from "@/components/platform/PageState";
import FormField from "@/components/platform/FormField";
import FormActions from "@/components/platform/FormActions";
import ValidationSummary from "@/components/platform/ValidationSummary";
import { ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";
import { brandName } from "@/brand/theme";
import { roleLabels, Role } from "@/src/config/roles";
import {
  getApiKeys,
  getIntegrations,
  getOrganization,
  getUsers,
} from "@/src/api/settings";

export default async function SettingsPage() {
  const [users, organization, keys, integrations] = await Promise.all([
    getUsers(),
    getOrganization(),
    getApiKeys(),
    getIntegrations(),
  ]);

  const failed = [users, organization, keys, integrations].some((item) => !item.ok);

  return (
    <>
      <PageHeader
        title="Nastavitve"
        description="Profil, podjetje, brand, uporabniki, API ključi in integracije. Polja so samo prikaz."
      />

      <PageState
        status={failed ? "error" : "ready"}
        errorDescription="Nastavitev ni bilo mogoče naložiti."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard title="Profil">
            <ValidationSummary errors={[]} />
            <div className="space-y-4">
              <FormField id="settings-name" label="Ime" defaultValue="Operater" readOnly />
              <FormField
                id="settings-email"
                label="E-pošta"
                defaultValue="operater@demo.local"
                readOnly
              />
            </div>
            <FormActions>
              <button
                type="button"
                className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
                disabled
              >
                Shrani
              </button>
            </FormActions>
          </SectionCard>

          <SectionCard title="Podjetje">
            {organization.ok ? (
              <div className="space-y-4">
                <FormField
                  id="settings-company"
                  label="Naziv"
                  defaultValue={organization.data.name}
                  readOnly
                />
                <FormField
                  id="settings-address"
                  label="Naslov"
                  defaultValue={organization.data.address}
                  readOnly
                />
              </div>
            ) : null}
          </SectionCard>

          <SectionCard title="Brand" description="Vrednosti iz obstoječega brand sistema.">
            <dl className="space-y-3 text-[14px]">
              <div>
                <dt className={metaClass}>Ime</dt>
                <dd className="text-slate-200 light:text-slate-800">{brandName}</dd>
              </div>
              <div>
                <dt className={metaClass}>Barva</dt>
                <dd className="text-[#16a34a]">#16A34A</dd>
              </div>
              <div>
                <dt className={metaClass}>Ozadje</dt>
                <dd className="text-slate-200 light:text-slate-800">#050816</dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard title="Uporabniki">
            {users.ok ? (
              <ul className="space-y-3">
                {users.data.map((user) => (
                  <li key={user.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] text-white light:text-slate-900">{user.name}</p>
                      <p className={metaClass}>{user.email}</p>
                    </div>
                    <StatusBadge
                      label={roleLabels[user.role as Role] ?? user.role}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </SectionCard>

          <SectionCard title="API ključi" description="Maskirani demo nizi. Ni produkcijskih skrivnosti.">
            {keys.ok ? (
              <ul className="space-y-3">
                {keys.data.map((key) => (
                  <li key={key.id}>
                    <p className="text-[14px] text-white light:text-slate-900">{key.name}</p>
                    <p className={`${metaClass} font-mono`}>{key.masked}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </SectionCard>

          <SectionCard title="Integracije">
            {integrations.ok ? (
              <ul className="space-y-3">
                {integrations.data.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-slate-300 light:text-slate-700">
                      {item.name}
                    </span>
                    <StatusBadge label={item.status} tone={statusTone(item.status)} />
                  </li>
                ))}
              </ul>
            ) : null}
          </SectionCard>
        </div>
      </PageState>
    </>
  );
}

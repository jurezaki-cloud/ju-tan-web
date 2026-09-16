import {
  Bot,
  Building2,
  CircleDollarSign,
  FolderKanban,
  ListTodo,
  Ticket,
} from "lucide-react";
import PageHeader from "@/components/platform/PageHeader";
import StatsCard from "@/components/platform/StatsCard";
import SectionCard from "@/components/platform/SectionCard";
import PageState from "@/components/platform/PageState";
import { getDashboard } from "@/src/api/settings";
import DashboardIdentity from "@/components/platform/DashboardIdentity";
import { metaClass } from "@/design";

export default async function DashboardPage() {
  const result = await getDashboard();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Pregled projektov, strank, ticketov in AI avtomatizacij. Podatki so demo."
      />
      <DashboardIdentity />
      <PageState
        status={!result.ok ? "error" : "ready"}
        errorDescription={result.ok ? undefined : result.error}
      >
        {result.ok ? (
          <>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <li>
                <StatsCard
                  icon={FolderKanban}
                  label="Aktivni projekti"
                  value={String(result.data.activeProjects)}
                  hint="Vsi razen zaključenih"
                />
              </li>
              <li>
                <StatsCard
                  icon={Building2}
                  label="Nove stranke"
                  value={String(result.data.newClients)}
                  hint="Status Novo"
                />
              </li>
              <li>
                <StatsCard
                  icon={Ticket}
                  label="Odprti ticketi"
                  value={String(result.data.openTickets)}
                  hint="Status Open"
                />
              </li>
              <li>
                <StatsCard
                  icon={Bot}
                  label="AI avtomatizacije"
                  value={String(result.data.automations)}
                  hint="Aktivni tokovi"
                />
              </li>
              <li>
                <StatsCard
                  icon={CircleDollarSign}
                  label="Prihodki"
                  value={result.data.revenue}
                  hint="Demo znesek, tekoče obdobje"
                />
              </li>
              <li>
                <StatsCard
                  icon={ListTodo}
                  label="Naloge"
                  value={String(result.data.tasks.length)}
                  hint="Odprte interne naloge"
                />
              </li>
            </ul>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SectionCard title="Activity feed" description="Zadnji dogodki v sistemu.">
                <ol className="space-y-3">
                  {result.data.activity.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <span className={`${metaClass} w-16 shrink-0 tabular-nums`}>{item.time}</span>
                      <span className="text-[14px] leading-[1.55] text-slate-300 light:text-slate-700">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </SectionCard>

              <SectionCard title="Naloge" description="Interni seznam, brez backend sinhronizacije.">
                <ul className="space-y-3">
                  {result.data.tasks.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0 light:border-slate-200"
                    >
                      <span className="text-[14px] text-slate-300 light:text-slate-700">
                        {item.text}
                      </span>
                      <span className={metaClass}>{item.due}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </div>
          </>
        ) : null}
      </PageState>
    </>
  );
}

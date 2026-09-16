import PageHeader from "@/components/platform/PageHeader";
import TicketsTable from "@/components/platform/tables/TicketsTable";
import StatsCard from "@/components/platform/StatsCard";
import PageState from "@/components/platform/PageState";
import { CircleDot, Loader, Check } from "lucide-react";
import { getTickets } from "@/src/api/tickets";

export default async function TicketsPage() {
  const result = await getTickets();
  const status = !result.ok ? "error" : result.data.length === 0 ? "empty" : "ready";
  const open = result.ok ? result.data.filter((item) => item.status === "Open").length : 0;
  const progress = result.ok
    ? result.data.filter((item) => item.status === "In progress").length
    : 0;
  const resolved = result.ok
    ? result.data.filter((item) => item.status === "Resolved").length
    : 0;

  return (
    <>
      <PageHeader
        title="Ticketi"
        description="Support: Open, In progress, Resolved in prioritet."
      />
      <PageState
        status={status}
        emptyTitle="Ni ticketov"
        emptyDescription="Support predal je prazen."
        errorDescription={result.ok ? undefined : result.error}
      >
        {result.ok ? (
          <>
            <ul className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <li>
                <StatsCard icon={CircleDot} label="Open" value={String(open)} />
              </li>
              <li>
                <StatsCard icon={Loader} label="In progress" value={String(progress)} />
              </li>
              <li>
                <StatsCard icon={Check} label="Resolved" value={String(resolved)} />
              </li>
            </ul>
            <TicketsTable rows={result.data} />
          </>
        ) : null}
      </PageState>
    </>
  );
}

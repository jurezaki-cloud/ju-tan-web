"use client";

import { KeyRound, Laptop, Radio, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import StatsCard from "@/components/platform/StatsCard";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";

type LicenseRow = {
  id: string;
  company_name: string;
  status: "active" | "expired" | "blocked";
  max_devices: number;
  valid_until: string | null;
  offline_grace_days: number;
  created_at: string;
  updated_at: string;
  total_activations: number;
  active_devices: number;
  last_seen_at: string | null;
  online: boolean;
  app_versions: string[];
};

const dateTime = new Intl.DateTimeFormat("sl-SI", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string | null) {
  return value ? dateTime.format(new Date(value)) : "—";
}

export default function AdminLicensesPage() {
  const [rows, setRows] = useState<LicenseRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/admin/licenses", { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as {
          ok?: boolean;
          items?: LicenseRow[];
          error?: string;
        };
        if (response.status === 401) {
          setNeedsLogin(true);
          return;
        }
        if (!response.ok || !body.ok || !body.items) {
          setError(body.error ?? "Licenc ni bilo mogoče naložiti.");
          return;
        }
        setRows(body.items);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError("Licenc ni bilo mogoče naložiti.");
      });
    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const items = rows ?? [];
    return {
      licenses: items.length,
      active: items.filter((item) => item.status === "active").length,
      devices: items.reduce((sum, item) => sum + item.active_devices, 0),
      online: items.reduce((sum, item) => sum + (item.online ? 1 : 0), 0),
    };
  }, [rows]);

  const columns: DataColumn<LicenseRow>[] = [
    {
      key: "company_name",
      header: "Imetnik",
      sortable: true,
      render: (row) => <span className="font-medium text-white light:text-slate-900">{row.company_name}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge label={row.status === "active" ? "Aktivna" : row.status} tone={statusTone(row.status)} />,
    },
    {
      key: "active_devices",
      header: "Naprave",
      sortable: true,
      sortValue: (row) => row.active_devices,
      render: (row) => `${row.active_devices} / ${row.max_devices}`,
    },
    {
      key: "online",
      header: "Povezava",
      sortable: true,
      sortValue: (row) => Number(row.online),
      render: (row) => <StatusBadge label={row.online ? "Povezano" : "Brez povezave"} tone={row.online ? "success" : "neutral"} />,
    },
    {
      key: "app_versions",
      header: "Različica",
      hideOnMobile: true,
      render: (row) => row.app_versions.length ? row.app_versions.join(", ") : "—",
    },
    {
      key: "last_seen_at",
      header: "Zadnja povezava",
      hideOnMobile: true,
      sortable: true,
      sortValue: (row) => row.last_seen_at ? Date.parse(row.last_seen_at) : 0,
      render: (row) => formatDate(row.last_seen_at),
    },
    {
      key: "valid_until",
      header: "Veljavnost",
      hideOnMobile: true,
      sortable: true,
      render: (row) => row.valid_until ? formatDate(row.valid_until) : "Neomejeno",
    },
  ];

  const status = error ? "error" : !rows ? "loading" : rows.length === 0 ? "empty" : "ready";

  if (needsLogin) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#050816] px-4 light:bg-slate-50">
        <form className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] p-8 light:border-slate-200 light:bg-white" onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          const response = await fetch("/api/license-admin/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
          const body = await response.json() as { error?: string };
          if (!response.ok) { setError(body.error ?? "Prijava ni uspela."); return; }
          window.location.reload();
        }}>
          <h1 className="heading-display font-heading font-semibold text-white light:text-slate-900">Administracija licenc</h1>
          <p className="mt-2 text-sm text-slate-400 light:text-slate-600">Vnesi administratorsko geslo JU-TAN.</p>
          <label className="mt-6 block text-sm text-slate-300 light:text-slate-700">Geslo
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-white light:border-slate-300 light:bg-white light:text-slate-900" />
          </label>
          {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
          <button type="submit" className="mt-6 min-h-11 w-full rounded-lg bg-[#16a34a] px-4 font-semibold text-white hover:bg-[#15803d]">Prijava</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#050816] px-4 py-10 light:bg-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="Licence JU-TAN Office"
        description="Pregled veljavnosti, aktiviranih računalnikov in zadnjih povezav. Licenčni ključi zaradi varnosti niso prikazani."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Vse licence" value={String(stats.licenses)} icon={KeyRound} />
        <StatsCard label="Aktivne licence" value={String(stats.active)} icon={ShieldCheck} />
        <StatsCard label="Aktivne naprave" value={String(stats.devices)} icon={Laptop} />
        <StatsCard label="Trenutno povezane" value={String(stats.online)} hint="Aktivnost v zadnjih 15 minutah" icon={Radio} />
      </div>

      <PageState
        status={status}
        emptyTitle="Ni licenc"
        emptyDescription="Ko ustvarite prvo licenco, se bo prikazala tukaj."
        errorDescription={error ?? undefined}
      >
        {rows ? (
          <DataTable
            rows={rows}
            columns={columns}
            caption="Licence JU-TAN Office"
            searchPlaceholder="Išči po imetniku ali različici"
            searchKeys={["company_name", "status", "app_versions"]}
            filters={[
              { id: "all", label: "Vse" },
              { id: "active", label: "Aktivne" },
              { id: "expired", label: "Potekle" },
              { id: "blocked", label: "Blokirane" },
            ]}
            filterKey="status"
            pageSize={10}
          />
        ) : null}
      </PageState>
      </div>
    </main>
  );
}

"use client";

import { KeyRound, Laptop, Radio, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import PageHeader from "@/components/platform/PageHeader";
import PageState from "@/components/platform/PageState";
import StatsCard from "@/components/platform/StatsCard";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import RoleGuard from "@/components/platform/auth/RoleGuard";
import { Role } from "@/src/config/roles";

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

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/admin/licenses", { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as {
          ok?: boolean;
          items?: LicenseRow[];
          error?: string;
        };
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

  return (
    <RoleGuard roles={[Role.OWNER, Role.ADMIN]}>
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
    </RoleGuard>
  );
}

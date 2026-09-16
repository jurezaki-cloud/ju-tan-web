"use client";

import { useMemo } from "react";
import Link from "next/link";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import type { Lead } from "@/src/domain/lead";
import { textLinkClass } from "@/design";

export default function CrmTable({ rows }: { rows: Lead[] }) {
  const columns = useMemo<DataColumn<Lead>[]>(
    () => [
      {
        key: "name",
        header: "Ime",
        sortable: true,
        render: (row) => (
          <span className="font-medium text-white light:text-slate-900">{row.name}</span>
        ),
      },
      { key: "company", header: "Podjetje", sortable: true, render: (row) => row.company },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} />,
      },
      { key: "phone", header: "Telefon", hideOnMobile: true, render: (row) => row.phone },
      { key: "email", header: "Email", hideOnMobile: true, render: (row) => row.email },
      {
        key: "lastContact",
        header: "Zadnji stik",
        sortable: true,
        render: (row) => row.lastContact,
      },
      {
        key: "actions",
        header: "Akcije",
        render: (row) => (
          <Link href={`/crm/leads/${row.id}`} className={textLinkClass}>
            Lead
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      rows={rows}
      columns={columns}
      caption="CRM stiki"
      searchPlaceholder="Išči ime, podjetje, e-pošto"
      searchKeys={["name", "company", "email", "phone"]}
      filterKey="status"
      filters={[
        { id: "all", label: "Vsi" },
        { id: "Aktiven", label: "Aktiven" },
        { id: "Novo", label: "Novo" },
        { id: "Neaktiven", label: "Neaktiven" },
      ]}
    />
  );
}

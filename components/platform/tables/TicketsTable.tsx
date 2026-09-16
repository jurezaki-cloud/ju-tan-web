"use client";

import { useMemo } from "react";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import type { Ticket } from "@/src/domain/ticket";

export default function TicketsTable({ rows }: { rows: Ticket[] }) {
  const columns = useMemo<DataColumn<Ticket>[]>(
    () => [
      {
        key: "id",
        header: "ID",
        render: (row) => (
          <span className="tabular-nums text-slate-500">{row.id}</span>
        ),
      },
      {
        key: "title",
        header: "Ticket",
        sortable: true,
        render: (row) => (
          <span className="font-medium text-white light:text-slate-900">{row.title}</span>
        ),
      },
      { key: "requester", header: "Stranka", render: (row) => row.requester },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} />,
      },
      {
        key: "priority",
        header: "Priority",
        render: (row) => (
          <StatusBadge label={row.priority} tone={statusTone(row.priority)} />
        ),
      },
      { key: "updated", header: "Posodobljeno", hideOnMobile: true, render: (row) => row.updated },
    ],
    [],
  );

  return (
    <DataTable
      rows={rows}
      columns={columns}
      caption="Ticketi"
      searchPlaceholder="Išči ticket"
      searchKeys={["id", "title", "requester", "status"]}
      filterKey="status"
      filters={[
        { id: "all", label: "Vsi" },
        { id: "Open", label: "Open" },
        { id: "In progress", label: "In progress" },
        { id: "Resolved", label: "Resolved" },
      ]}
    />
  );
}

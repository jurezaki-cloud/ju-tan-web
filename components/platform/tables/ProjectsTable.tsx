"use client";

import { useMemo } from "react";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import type { Project } from "@/src/domain/project";

function Progress({ value }: { value: number }) {
  return (
    <div className="flex min-w-[7rem] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-lg bg-white/10 light:bg-slate-200">
        <div
          className="h-full rounded-lg bg-[#16a34a]"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="tabular-nums text-[12px] text-slate-500">{value} %</span>
    </div>
  );
}

export default function ProjectsTable({ rows }: { rows: Project[] }) {
  const columns = useMemo<DataColumn<Project>[]>(
    () => [
      {
        key: "name",
        header: "Projekt",
        sortable: true,
        render: (row) => (
          <div>
            <p className="font-medium text-white light:text-slate-900">{row.name}</p>
            <p className="text-[12px] text-slate-500">{row.clientName}</p>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} />,
      },
      {
        key: "progress",
        header: "Napredek",
        sortable: true,
        sortValue: (row) => row.progress,
        render: (row) => <Progress value={row.progress} />,
      },
      { key: "owner", header: "Odgovorna oseba", sortable: true, render: (row) => row.owner },
      { key: "due", header: "Rok", hideOnMobile: true, render: (row) => row.due },
      {
        key: "priority",
        header: "Prioriteta",
        render: (row) => (
          <StatusBadge label={row.priority} tone={statusTone(row.priority)} />
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      rows={rows}
      columns={columns}
      caption="Projekti"
      searchPlaceholder="Išči projekt ali stranko"
      searchKeys={["name", "clientName", "owner", "status"]}
      filterKey="status"
      filters={[
        { id: "all", label: "Vsi" },
        { id: "Načrt", label: "Načrt" },
        { id: "V teku", label: "V teku" },
        { id: "Testiranje", label: "Testiranje" },
        { id: "Uvedba", label: "Uvedba" },
        { id: "Zaključeno", label: "Zaključeno" },
      ]}
    />
  );
}

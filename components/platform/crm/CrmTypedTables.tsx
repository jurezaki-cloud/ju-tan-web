"use client";

import Link from "next/link";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import { textLinkClass } from "@/design";
import type { Lead } from "@/src/domain/lead";
import type { Activity, Note, Opportunity, Quote, Task } from "@/src/domain/crm";
import type { Offer, OfferApproval, OfferRevision, OfferTemplate } from "@/src/domain/offers";

export function LeadsTable({ rows }: { rows: Lead[] }) {
  const columns: DataColumn<Lead>[] = [
    { key: "name", header: "Ime", sortable: true, render: (row) => <Link href={`/crm/leads/${row.id}`} className={textLinkClass}>{row.name}</Link> },
    { key: "company", header: "Podjetje", sortable: true, render: (row) => row.company },
    { key: "status", header: "Status", render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} /> },
    { key: "email", header: "E-pošta", hideOnMobile: true, render: (row) => row.email },
  ];
  return <DataTable rows={rows} columns={columns} caption="Leadi" searchPlaceholder="Iskanje" searchKeys={["name", "company", "email"]} selectable filterKey="status" filters={[{ id: "all", label: "Vsi" }, { id: "Aktiven", label: "Aktiven" }, { id: "Novo", label: "Novo" }]} />;
}

export function OpportunitiesTable({ rows }: { rows: Opportunity[] }) {
  const columns: DataColumn<Opportunity>[] = [
    { key: "name", header: "Ime", sortable: true, render: (row) => row.name },
    { key: "stage", header: "Faza", render: (row) => <StatusBadge label={row.stage ?? row.status} tone={statusTone(row.stage ?? row.status)} /> },
    { key: "amount", header: "Znesek", sortable: true, render: (row) => row.amount ?? "—" },
    { key: "closeDate", header: "Zaključek", hideOnMobile: true, render: (row) => row.closeDate ?? "—" },
  ];
  return <DataTable rows={rows} columns={columns} caption="Priložnosti" searchPlaceholder="Iskanje" searchKeys={["name"]} selectable />;
}

export function ActivitiesTable({ rows }: { rows: Activity[] }) {
  const columns: DataColumn<Activity>[] = [
    { key: "name", header: "Zadeva", sortable: true, render: (row) => row.subject ?? row.name },
    { key: "type", header: "Tip", render: (row) => row.type ?? row.kind ?? "—" },
    { key: "status", header: "Status", render: (row) => row.status },
    { key: "dueAt", header: "Rok", hideOnMobile: true, render: (row) => row.dueAt ?? "—" },
  ];
  return <DataTable rows={rows} columns={columns} caption="Aktivnosti" searchPlaceholder="Iskanje" searchKeys={["name"]} selectable />;
}

export function TasksTable({ rows }: { rows: Task[] }) {
  const columns: DataColumn<Task>[] = [
    { key: "name", header: "Naloga", sortable: true, render: (row) => row.name },
    { key: "priority", header: "Prioriteta", render: (row) => <StatusBadge label={row.priority ?? "—"} tone={statusTone(row.priority ?? "")} /> },
    { key: "dueAt", header: "Rok", sortable: true, render: (row) => row.dueAt ?? row.due ?? "—" },
    { key: "status", header: "Status", render: (row) => row.status },
  ];
  return <DataTable rows={rows} columns={columns} caption="Naloge" searchPlaceholder="Iskanje" searchKeys={["name"]} selectable />;
}

export function NotesTable({ rows }: { rows: Note[] }) {
  const columns: DataColumn<Note>[] = [
    { key: "name", header: "Opomba", sortable: true, render: (row) => row.body ?? row.name ?? "" },
    { key: "clientId", header: "Stranka", render: (row) => row.clientId ?? "—" },
    { key: "status", header: "Status", render: (row) => row.status },
  ];
  return <DataTable rows={rows} columns={columns} caption="Opombe" searchPlaceholder="Iskanje" searchKeys={["name"]} selectable />;
}

export function QuotesTable({ rows }: { rows: Quote[] }) {
  const columns: DataColumn<Quote>[] = [
    { key: "name", header: "Ponudba", sortable: true, render: (row) => row.title ?? row.name },
    { key: "number", header: "Številka", render: (row) => row.number ?? "—" },
    { key: "amount", header: "Znesek", sortable: true, render: (row) => `${row.amount ?? "—"} ${row.currency ?? ""}` },
    { key: "status", header: "Status", render: (row) => row.status },
  ];
  return <DataTable rows={rows} columns={columns} caption="Ponudbe" searchPlaceholder="Iskanje" searchKeys={["name"]} selectable />;
}

export function OffersTable({ rows }: { rows: Offer[] }) {
  const columns: DataColumn<Offer>[] = [
    { key: "number", header: "Številka", sortable: true, render: (row) => <Link href={`/crm/offers/${row.id}`} className={textLinkClass}>{row.number}</Link> },
    { key: "title", header: "Naziv", sortable: true, render: (row) => row.title },
    { key: "clientId", header: "Stranka", render: (row) => row.clientId ? <Link href={`/clients/${row.clientId}`} className={textLinkClass}>{row.clientId}</Link> : "—" },
    { key: "leadId", header: "Lead", hideOnMobile: true, render: (row) => row.leadId ?? "—" },
    { key: "status", header: "Status", render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} /> },
    { key: "total", header: "Skupaj", sortable: true, sortValue: (row) => row.total, render: (row) => `${row.total} ${row.currency}` },
    { key: "validUntil", header: "Veljavno", hideOnMobile: true, render: (row) => row.validUntil ?? "—" },
    { key: "updatedAt", header: "Posodobljeno", hideOnMobile: true, sortable: true, render: (row) => row.updatedAt.slice(0, 10) },
  ];
  return (
    <DataTable
      rows={rows}
      columns={columns}
      caption="Ponudbe"
      searchPlaceholder="Iskanje ponudb"
      searchKeys={["number", "title", "status"]}
      selectable
      filterKey="status"
      filters={[
        { id: "all", label: "Vsi" },
        { id: "Draft", label: "Draft" },
        { id: "InReview", label: "InReview" },
        { id: "WaitingApproval", label: "WaitingApproval" },
        { id: "Approved", label: "Approved" },
        { id: "Rejected", label: "Rejected" },
        { id: "Sent", label: "Sent" },
        { id: "Archived", label: "Archived" },
      ]}
    />
  );
}

export function OfferTemplatesTable({ rows }: { rows: OfferTemplate[] }) {
  const columns: DataColumn<OfferTemplate>[] = [
    { key: "name", header: "Predloga", sortable: true, render: (row) => row.name },
    { key: "title", header: "Naziv", render: (row) => row.title },
    { key: "currency", header: "Valuta", render: (row) => row.currency },
    { key: "status", header: "Status", render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} /> },
    { key: "updatedAt", header: "Posodobljeno", hideOnMobile: true, render: (row) => row.updatedAt.slice(0, 10) },
  ];
  return <DataTable rows={rows} columns={columns} caption="Predloge" searchPlaceholder="Iskanje" searchKeys={["name", "title"]} selectable />;
}

export function OfferRevisionsTable({ rows }: { rows: OfferRevision[] }) {
  const columns: DataColumn<OfferRevision>[] = [
    { key: "revisionNumber", header: "Revizija", sortable: true, sortValue: (row) => row.revisionNumber, render: (row) => `R${row.revisionNumber}` },
    { key: "changeSummary", header: "Spremembe", render: (row) => row.changeSummary },
    { key: "changedBy", header: "Avtor", render: (row) => row.changedBy },
    { key: "updatedAt", header: "Posodobljeno", hideOnMobile: true, render: (row) => row.updatedAt.slice(0, 10) },
  ];
  return <DataTable rows={rows} columns={columns} caption="Revizije" searchPlaceholder="Iskanje" searchKeys={["changeSummary"]} selectable />;
}

export function OfferApprovalsTable({ rows }: { rows: OfferApproval[] }) {
  const columns: DataColumn<OfferApproval>[] = [
    { key: "decision", header: "Odločitev", sortable: true, render: (row) => <StatusBadge label={row.decision} tone={statusTone(row.decision)} /> },
    { key: "comment", header: "Komentar", render: (row) => row.comment ?? "—" },
    { key: "approvedBy", header: "Odobril", render: (row) => row.approvedBy ?? "—" },
    { key: "updatedAt", header: "Posodobljeno", hideOnMobile: true, render: (row) => row.updatedAt.slice(0, 10) },
  ];
  return <DataTable rows={rows} columns={columns} caption="Odobritve" searchPlaceholder="Iskanje" searchKeys={["decision", "comment"]} selectable />;
}

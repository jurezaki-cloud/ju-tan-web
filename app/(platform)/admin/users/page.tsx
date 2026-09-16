"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/platform/PageHeader";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import PageState from "@/components/platform/PageState";
import { ctaBase, ctaSizes, ctaVariants, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";
import type { AdminUserView, UserAdminListResult } from "@/src/types/identity";

export default function AdminUsersPage() {
  const [result, setResult] = useState<UserAdminListResult<AdminUserView> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/users")
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; data?: UserAdminListResult<AdminUserView>; error?: string };
        if (!response.ok || !body.ok || !body.data) {
          setError(body.error ?? "Seznama ni bilo mogoče naložiti.");
          return;
        }
        setResult(body.data);
      })
      .catch(() => setError("Seznama ni bilo mogoče naložiti."));
  }, []);

  const columns: DataColumn<AdminUserView>[] = [
    {
      key: "name",
      header: "Ime",
      sortable: true,
      sortValue: (row) => `${row.firstName} ${row.lastName}`,
      render: (row) => (
        <Link href={`/admin/users/${row.id}`} className={textLinkClass}>
          {row.firstName} {row.lastName}
        </Link>
      ),
    },
    { key: "email", header: "E-pošta", sortable: true, render: (row) => row.email },
    { key: "role", header: "Vloga", sortable: true, render: (row) => row.role },
    { key: "department", header: "Oddelek", hideOnMobile: true, render: (row) => row.department || "—" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} />,
    },
    {
      key: "lastLogin",
      header: "Zadnja prijava",
      hideOnMobile: true,
      sortable: true,
      render: (row) => row.lastLogin ?? "—",
    },
    { key: "workspaceId", header: "Workspace", hideOnMobile: true, render: (row) => row.workspaceId },
    {
      key: "actions",
      header: "Akcije",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/users/${row.id}`} className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
            Odpri
          </Link>
          <Link href={`/admin/users/${row.id}/invites`} className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
            Povabila
          </Link>
        </div>
      ),
    },
  ];

  const status = error ? "error" : !result ? "loading" : result.items.length === 0 ? "empty" : "ready";

  return (
    <>
      <PageHeader
        title="Uporabniki"
        description="Invite-based upravljanje računov. Javne registracije ni."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/invites" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
              Povabila
            </Link>
            <Link href="/admin/users/new" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
              Novo povabilo
            </Link>
          </div>
        }
      />
      <PageState status={status} emptyTitle="Ni uporabnikov" errorDescription={error ?? undefined}>
        {result ? (
          <DataTable
            rows={result.items}
            columns={columns}
            caption="Uporabniki"
            searchKeys={["email", "firstName", "lastName", "department", "role", "workspaceId"]}
            filters={[
              { id: "all", label: "Vsi" },
              { id: "invited", label: "Povabljeni" },
              { id: "active", label: "Aktivni" },
              { id: "disabled", label: "Onemogočeni" },
              { id: "archived", label: "Arhivirani" },
            ]}
            filterKey="status"
            pageSize={8}
            selectable
          />
        ) : null}
      </PageState>
    </>
  );
}

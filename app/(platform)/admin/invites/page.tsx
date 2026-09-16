"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/platform/PageHeader";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import PageState from "@/components/platform/PageState";
import ConfirmDialog from "@/components/platform/ConfirmDialog";
import { ctaBase, ctaSizes, ctaVariants, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";
import type { InvitePublic } from "@/src/types/identity";

export default function AdminInvitesPage() {
  const [rows, setRows] = useState<InvitePublic[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/invites")
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; data?: InvitePublic[]; error?: string };
        if (!response.ok || !body.ok) {
          setError(body.error ?? "Povabil ni mogoče naložiti.");
          return;
        }
        setRows(body.data ?? []);
      })
      .catch(() => setError("Povabil ni mogoče naložiti."));
  }, []);

  const columns: DataColumn<InvitePublic>[] = [
    {
      key: "email",
      header: "E-pošta",
      sortable: true,
      render: (row) => (
        <Link href={`/admin/invites/${row.id}`} className={textLinkClass}>
          {row.email}
        </Link>
      ),
    },
    { key: "role", header: "Vloga", sortable: true, render: (row) => row.role },
    { key: "workspaceId", header: "Workspace", hideOnMobile: true, render: (row) => row.workspaceId },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={row.status} tone={statusTone(row.status)} />
          {row.security?.status && row.security.status !== "active" ? (
            <StatusBadge label={row.security.status} tone={statusTone(row.security.status)} />
          ) : null}
          {row.security?.flagged ? <StatusBadge label="suspicious" tone={statusTone("flagged")} /> : null}
          {row.security?.lockedUntil ? <StatusBadge label="cooldown" tone={statusTone("cooldown")} /> : null}
          {row.security?.storeDegraded ? <StatusBadge label="degraded" tone={statusTone("degraded")} /> : null}
        </div>
      ),
    },
    { key: "expiresAt", header: "Poteče", hideOnMobile: true, sortable: true, render: (row) => row.expiresAt },
    { key: "createdAt", header: "Ustvarjeno", hideOnMobile: true, sortable: true, render: (row) => row.createdAt },
    { key: "invitedBy", header: "Povabil", hideOnMobile: true, render: (row) => row.invitedBy },
    {
      key: "actions",
      header: "Akcije",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/invites/${row.id}`} className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
            Odpri
          </Link>
          <button
            type="button"
            className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
            onClick={async () => {
              const response = await fetch(`/api/admin/invites/${row.id}/resend`, { method: "POST" });
              const body = (await response.json()) as { error?: string; retryAfter?: number; rateLimited?: boolean };
              if (response.status === 429 || body.rateLimited) {
                setNotice(body.retryAfter ? `Ponovni poskus čez ${body.retryAfter}s.` : (body.error ?? "Zahteva trenutno ni mogoča."));
                return;
              }
              setNotice("Povabilo je ponovno pripravljeno.");
            }}
          >
            Ponovno pošlji
          </button>
          <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)} onClick={() => setRevokeId(row.id)}>
            Prekliči
          </button>
        </div>
      ),
    },
  ];

  const status = error ? "error" : !rows ? "loading" : rows.length === 0 ? "empty" : "ready";

  return (
    <>
      <PageHeader title="Povabila" description="Vsi invite žetoni v tenantu." />
      {notice ? <p className="mb-4 text-sm text-slate-400">{notice}</p> : null}
      <PageState status={status} emptyTitle="Ni povabil" errorDescription={error ?? undefined}>
        {rows ? (
          <DataTable
            rows={rows}
            columns={columns}
            caption="Povabila"
            searchKeys={["email", "role", "status", "workspaceId", "invitedBy"]}
            filters={[
              { id: "all", label: "Vsa" },
              { id: "pending", label: "Čakajoča" },
              { id: "sent", label: "Poslana" },
              { id: "accepted", label: "Sprejeta" },
              { id: "expired", label: "Potekla" },
              { id: "revoked", label: "Preklicana" },
            ]}
            filterKey="status"
            pageSize={8}
            selectable
          />
        ) : null}
      </PageState>
      <ConfirmDialog
        open={Boolean(revokeId)}
        title="Prekliči povabilo"
        description="Žeton ne bo več veljaven."
        onConfirm={() => {
          if (revokeId) void fetch(`/api/admin/invites/${revokeId}/revoke`, { method: "POST" });
          setRevokeId(null);
        }}
        onCancel={() => setRevokeId(null)}
      />
    </>
  );
}

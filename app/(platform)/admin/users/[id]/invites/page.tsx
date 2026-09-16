"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/platform/PageHeader";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import ConfirmDialog from "@/components/platform/ConfirmDialog";
import PageState from "@/components/platform/PageState";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import { ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";
import type { InvitePublic } from "@/src/types/identity";

export default function UserInvitesPage() {
  const params = useParams<{ id: string }>();
  const [rows, setRows] = useState<InvitePublic[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(() => {
    void fetch(`/api/admin/users/${params.id}/invites`)
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; data?: InvitePublic[]; error?: string };
        if (!response.ok || !body.ok) {
          setError(body.error ?? "Povabil ni mogoče naložiti.");
          return;
        }
        setRows(body.data ?? []);
      })
      .catch(() => setError("Povabil ni mogoče naložiti."));
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  const columns: DataColumn<InvitePublic>[] = [
    { key: "email", header: "E-pošta", render: (row) => row.email },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status === "pending" ? "Aktiven" : row.status)} />,
    },
    { key: "expiresAt", header: "Poteče", hideOnMobile: true, render: (row) => row.expiresAt },
    {
      key: "actions",
      header: "Akcije",
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
            onClick={async () => {
              const response = await fetch(`/api/admin/invites/${row.id}/resend`, { method: "POST" });
              const body = (await response.json()) as { data?: { invite?: { inviteLink?: string } } };
              setNotice(body.data?.invite?.inviteLink ?? "Povabilo je ponovno pripravljeno.");
              load();
            }}
          >
            Ponovno pošlji
          </button>
          <button
            type="button"
            className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
            onClick={() => setRevokeId(row.id)}
          >
            Prekliči
          </button>
        </div>
      ),
    },
  ];

  const status = error ? "error" : !rows ? "loading" : rows.length === 0 ? "empty" : "ready";

  return (
    <>
      <PageHeader title="Povabila uporabnika" description="Ponovno pošiljanje in preklic žetonov." />
      {notice ? <p className={`mb-4 ${metaClass}`}>{notice}</p> : null}
      <PageState status={status} emptyTitle="Ni povabil" errorDescription={error ?? undefined}>
        {rows ? <DataTable rows={rows} columns={columns} caption="Povabila" pageSize={8} /> : null}
      </PageState>
      <ConfirmDialog
        open={Boolean(revokeId)}
        title="Prekliči povabilo"
        description="Žeton ne bo več veljaven."
        onConfirm={() => {
          if (revokeId) {
            void fetch(`/api/admin/invites/${revokeId}/revoke`, { method: "POST" }).then(() => load());
          }
          setRevokeId(null);
        }}
        onCancel={() => setRevokeId(null)}
      />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/platform/PageHeader";
import SectionCard from "@/components/platform/SectionCard";
import FormActions from "@/components/platform/FormActions";
import FormField from "@/components/platform/FormField";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import ConfirmDialog from "@/components/platform/ConfirmDialog";
import PageState from "@/components/platform/PageState";
import { ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";
import type { InvitePublic, UserAuditEvent } from "@/src/types/identity";

type InviteDetail = InvitePublic & {
  audit?: UserAuditEvent[];
  inviteLink?: string;
  deliveries?: {
    id: string;
    channel: string;
    provider: string;
    status: string;
    payloadPreview: string;
    sentAt?: string;
    failureReason?: string;
    nextRetryAt?: string;
  }[];
  deliveryStatus?: string;
  providers?: string[];
};

export default function AdminInviteDetailPage() {
  const params = useParams<{ id: string }>();
  const [invite, setInvite] = useState<InviteDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [revokeOpen, setRevokeOpen] = useState(false);

  useEffect(() => {
    void fetch(`/api/admin/invites/${params.id}`)
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; data?: InviteDetail; error?: string };
        if (!response.ok || !body.ok || !body.data) {
          setError(body.error ?? "Povabila ni mogoče naložiti.");
          return;
        }
        setInvite(body.data);
      })
      .catch(() => setError("Povabila ni mogoče naložiti."));
  }, [params.id]);

  const link = invite?.inviteLink;
  const absolute = link && typeof window !== "undefined" ? `${window.location.origin}${link}` : notice;

  return (
    <>
      <PageHeader
        title="Povabilo"
        description="Podatki, žeton, audit in akcije."
        actions={
          invite ? (
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={invite.status} tone={statusTone(invite.status)} />
              {invite.security?.status && invite.security.status !== "active" ? (
                <StatusBadge label={invite.security.status} tone={statusTone(invite.security.status)} />
              ) : null}
              {invite.security?.flagged ? <StatusBadge label="suspicious" tone={statusTone("flagged")} /> : null}
              {invite.security?.lockedUntil ? <StatusBadge label="cooldown" tone={statusTone("cooldown")} /> : null}
              {invite.security?.storeDegraded ? <StatusBadge label="degraded" tone={statusTone("degraded")} /> : null}
              {invite.deliveryStatus ? <StatusBadge label={invite.deliveryStatus} tone={statusTone(invite.deliveryStatus)} /> : null}
            </div>
          ) : null
        }
      />
      {notice ? <p className={`mb-4 ${metaClass}`}>{notice}</p> : null}
      <PageState status={error ? "error" : !invite ? "loading" : "ready"} errorDescription={error ?? undefined}>
        {invite ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Invite">
              <div className="space-y-4">
                <FormField id="inv-email" label="E-pošta" defaultValue={invite.email} readOnly />
                <FormField id="inv-role" label="Vloga" defaultValue={invite.role} readOnly />
                <FormField id="inv-ws" label="Workspace" defaultValue={invite.workspaceId} readOnly />
                <FormField id="inv-dept" label="Oddelek" defaultValue={invite.department || "—"} readOnly />
                <FormField id="inv-note" label="Opomba" defaultValue={invite.note || "—"} readOnly />
                <FormField id="inv-exp" label="Poteče" defaultValue={invite.expiresAt} readOnly />
                <FormField id="inv-token" label="Žeton" defaultValue={invite.tokenMasked ?? "••••"} readOnly />
                <FormField id="inv-acc" label="Sprejeto" defaultValue={invite.acceptedAt ?? "—"} readOnly />
                <FormField id="inv-by" label="Sprejel" defaultValue={invite.acceptedBy ?? "—"} readOnly />
                {invite.security?.lockedUntil ? (
                  <FormField id="inv-lock" label="Zaklenjeno do" defaultValue={invite.security.lockedUntil} readOnly />
                ) : null}
                <FormField id="inv-attempts" label="Neveljavni poskusi" defaultValue={String(invite.security?.invalidAttempts ?? 0)} readOnly />
              </div>
              {absolute ? <p className={`mt-4 break-all ${metaClass}`}>{absolute}</p> : null}
              <FormActions>
                <button
                  type="button"
                  className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}
                  onClick={async () => {
                    const response = await fetch(`/api/admin/invites/${invite.id}/resend`, { method: "POST" });
                    const body = (await response.json()) as {
                      ok?: boolean;
                      error?: string;
                      retryAfter?: number;
                      cooldownUntil?: string;
                      rateLimited?: boolean;
                      data?: { invite?: { inviteLink?: string; status?: string } };
                    };
                    if (response.status === 429 || body.rateLimited) {
                      setError(body.error ?? "Zahteva trenutno ni mogoča.");
                      if (body.retryAfter) setNotice(`Ponovni poskus čez ${body.retryAfter}s.`);
                      return;
                    }
                    const nextLink = body.data?.invite?.inviteLink;
                    if (nextLink) {
                      setNotice(`${window.location.origin}${nextLink}`);
                      setInvite({ ...invite, status: body.data?.invite?.status ?? invite.status, inviteLink: nextLink });
                    }
                  }}
                >
                  Ponovno pošlji
                </button>
                <button
                  type="button"
                  className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
                  onClick={() => {
                    if (absolute) void navigator.clipboard.writeText(absolute);
                  }}
                >
                  Kopiraj povezavo
                </button>
                <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)} onClick={() => setRevokeOpen(true)}>
                  Prekliči
                </button>
              </FormActions>
            </SectionCard>
            <SectionCard title="Delivery">
              <p className={metaClass}>
                Status: {invite.deliveryStatus ?? "prepared"} · Providerji: {(invite.providers ?? []).join(", ") || "—"}
              </p>
              {!invite.deliveries?.length ? (
                <p className={`mt-3 ${metaClass}`}>Ni delivery poskusov.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {invite.deliveries.map((item) => (
                    <li key={item.id} className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge label={item.status} tone={statusTone(item.status)} />
                        <span className={metaClass}>
                          {item.channel} · {item.provider}
                        </span>
                        <button
                          type="button"
                          className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
                          onClick={() =>
                            void fetch(`/api/admin/invites/${invite.id}/retry`, {
                              method: "POST",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify({ deliveryId: item.id }),
                            })
                          }
                        >
                          Ponovi
                        </button>
                      </div>
                      <p className={metaClass}>{item.payloadPreview}</p>
                      <p className={metaClass}>{item.sentAt ?? item.failureReason ?? "prepared"}</p>
                      {item.nextRetryAt ? <p className={metaClass}>Ponovi po {item.nextRetryAt}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
            <SectionCard title="Audit">
              {!invite.audit?.length ? (
                <p className={metaClass}>Ni dogodkov.</p>
              ) : (
                <ol className="space-y-2">
                  {invite.audit.map((event) => (
                    <li key={event.id} className={metaClass}>
                      {event.type} · {event.createdAt}
                    </li>
                  ))}
                </ol>
              )}
            </SectionCard>
          </div>
        ) : null}
      </PageState>
      <ConfirmDialog
        open={revokeOpen}
        title="Prekliči povabilo"
        description="Žeton ne bo več veljaven."
        onConfirm={() => {
          if (invite) {
            void fetch(`/api/admin/invites/${invite.id}/revoke`, { method: "POST" }).then(() => {
              setInvite({ ...invite, status: "revoked" });
            });
          }
          setRevokeOpen(false);
        }}
        onCancel={() => setRevokeOpen(false)}
      />
    </>
  );
}

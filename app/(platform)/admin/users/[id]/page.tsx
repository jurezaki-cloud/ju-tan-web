"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/platform/PageHeader";
import SectionCard from "@/components/platform/SectionCard";
import FormField from "@/components/platform/FormField";
import FormActions from "@/components/platform/FormActions";
import FormSection from "@/components/platform/FormSection";
import ConfirmDialog from "@/components/platform/ConfirmDialog";
import DeleteDialog from "@/components/platform/DeleteDialog";
import PageState from "@/components/platform/PageState";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import { fieldClass, ctaBase, ctaSizes, ctaVariants, metaClass, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";
import type { AdminUserView, InvitePublic, UserAuditEvent } from "@/src/types/identity";
import type { PersistenceRecord } from "@/src/types/persistence";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<AdminUserView | null>(null);
  const [sessions, setSessions] = useState<PersistenceRecord[]>([]);
  const [invites, setInvites] = useState<InvitePublic[]>([]);
  const [audit, setAudit] = useState<UserAuditEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"deactivate" | "activate" | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);

  useEffect(() => {
    void fetch(`/api/admin/users/${params.id}`)
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; data?: AdminUserView; error?: string };
        if (!response.ok || !body.ok || !body.data) {
          setError(body.error ?? "Uporabnika ni mogoče naložiti.");
          return;
        }
        setUser(body.data);
      })
      .catch(() => setError("Uporabnika ni mogoče naložiti."));
    void fetch(`/api/admin/users/${params.id}/sessions`)
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; data?: PersistenceRecord[] };
        if (response.ok && body.ok && body.data) setSessions(body.data);
      })
      .catch(() => undefined);
    void fetch(`/api/admin/users/${params.id}/invites`)
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; data?: InvitePublic[] };
        if (response.ok && body.ok && body.data) setInvites(body.data);
      })
      .catch(() => undefined);
    void fetch(`/api/admin/users/${params.id}/audit`)
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; data?: UserAuditEvent[] };
        if (response.ok && body.ok && body.data) setAudit(body.data);
      })
      .catch(() => undefined);
  }, [params.id]);

  async function patch(body: Record<string, unknown>) {
    const response = await fetch(`/api/admin/users/${params.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as { ok?: boolean; data?: AdminUserView; error?: string };
    if (payload.ok && payload.data) setUser(payload.data);
  }

  const status = error ? "error" : !user ? "loading" : "ready";

  return (
    <>
      <PageHeader
        title={user ? `${user.firstName} ${user.lastName}` : "Uporabnik"}
        description="Profil, seje, povabila in audit."
        actions={user ? <StatusBadge label={user.status} tone={statusTone(user.status)} /> : null}
      />
      <PageState status={status} errorDescription={error ?? undefined}>
        {user ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Profile">
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  void patch({
                    firstName: form.get("firstName"),
                    lastName: form.get("lastName"),
                    department: form.get("department"),
                  });
                }}
              >
                <FormSection title="Osnovni podatki">
                  <FormField id="email" label="E-pošta" defaultValue={user.email} readOnly />
                  <FormField id="firstName" label="Ime">
                    <input id="firstName" name="firstName" className={fieldClass} defaultValue={user.firstName} />
                  </FormField>
                  <FormField id="lastName" label="Priimek">
                    <input id="lastName" name="lastName" className={fieldClass} defaultValue={user.lastName} />
                  </FormField>
                  <FormField id="department" label="Oddelek">
                    <input id="department" name="department" className={fieldClass} defaultValue={user.department} />
                  </FormField>
                </FormSection>
                <FormActions>
                  <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
                    Shrani
                  </button>
                  <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)} onClick={() => setConfirm("deactivate")}>
                    Deaktiviraj
                  </button>
                  <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)} onClick={() => setConfirm("activate")}>
                    Aktiviraj
                  </button>
                  <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)} onClick={() => setArchiveOpen(true)}>
                    Arhiviraj
                  </button>
                </FormActions>
              </form>
              <form
                id="assign-form"
                className="mt-4 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  void fetch(`/api/admin/users/${user.id}/role`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ role: form.get("role") }),
                  });
                  void fetch(`/api/admin/users/${user.id}/workspace`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ workspaceId: form.get("workspaceId") }),
                  });
                }}
              >
                <FormField id="role-assign" label="Vloga">
                  <input id="role-assign" name="role" className={fieldClass} defaultValue={user.role} />
                </FormField>
                <FormField id="assign-ws" label="Delovni prostor">
                  <input id="assign-ws" name="workspaceId" className={fieldClass} defaultValue={user.workspaceId} />
                </FormField>
                <FormActions>
                  <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
                    Shrani dodelitve
                  </button>
                </FormActions>
              </form>
              <p className={`mt-4 ${metaClass}`}>Zadnja prijava: {user.lastLogin ?? "—"}</p>
            </SectionCard>
            <SectionCard title="Sessions">
              {sessions.length === 0 ? (
                <p className={metaClass}>Ni aktivnih sej.</p>
              ) : (
                <ul className="space-y-2">
                  {sessions.map((session) => (
                    <li key={session.id} className="flex flex-wrap items-center justify-between gap-2">
                      <span className={metaClass}>
                        {session.id} · {String(session.metadata.device ?? "web")} · {session.updatedAt}
                      </span>
                      <button
                        type="button"
                        className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
                        onClick={async () => {
                          await fetch(`/api/admin/users/${user.id}/sessions`, {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ sessionId: session.id }),
                          });
                          setSessions((current) => current.filter((item) => item.id !== session.id));
                        }}
                      >
                        Prekliči
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
            <SectionCard title="Invites">
              {invites.length === 0 ? (
                <p className={metaClass}>Ni povabil.</p>
              ) : (
                <ul className="space-y-3">
                  {invites.map((invite) => (
                    <li key={invite.id} className="flex flex-wrap items-center justify-between gap-2">
                      <Link href={`/admin/invites/${invite.id}`} className={textLinkClass}>
                        {invite.email} · {invite.status}
                      </Link>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
                          onClick={() => void fetch(`/api/admin/invites/${invite.id}/resend`, { method: "POST" })}
                        >
                          Ponovno pošlji
                        </button>
                        <button
                          type="button"
                          className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
                          onClick={() => void fetch(`/api/admin/invites/${invite.id}/revoke`, { method: "POST" })}
                        >
                          Prekliči
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <FormActions>
                <Link href={`/admin/users/${user.id}/invites`} className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
                  Vsa povabila
                </Link>
              </FormActions>
            </SectionCard>
            <SectionCard title="Audit">
              {audit.length === 0 ? (
                <p className={metaClass}>Ni dogodkov.</p>
              ) : (
                <ol className="space-y-2">
                  {audit.map((event) => (
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
        open={confirm === "deactivate"}
        title="Deaktivacija"
        description="Uporabnik ne bo mogel več prijaviti. Seje bodo preklicane."
        onConfirm={() => {
          void patch({ status: "disabled" });
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "activate"}
        title="Aktivacija"
        description="Uporabnik bo spet lahko uporabljal platformo."
        onConfirm={() => {
          void patch({ status: "active" });
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
      <DeleteDialog
        open={archiveOpen}
        name={user?.email}
        onConfirm={() => {
          void patch({ status: "archived" });
          setArchiveOpen(false);
        }}
        onCancel={() => setArchiveOpen(false)}
      />
    </>
  );
}

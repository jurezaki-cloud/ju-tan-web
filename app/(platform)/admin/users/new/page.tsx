"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/platform/PageHeader";
import FormSection from "@/components/platform/FormSection";
import FormField from "@/components/platform/FormField";
import FormActions from "@/components/platform/FormActions";
import ErrorState from "@/components/platform/ErrorState";
import SectionCard from "@/components/platform/SectionCard";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import { fieldClass, ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";
import { Role, roleLabels } from "@/src/config/roles";
import type { InviteResult, NotificationPayload } from "@/src/types/identity";

async function copyValue(value: string) {
  await navigator.clipboard.writeText(value);
}

export default function NewUserInvitePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InviteResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        role: form.get("role"),
        workspaceId: form.get("workspaceId"),
        department: form.get("department"),
        note: form.get("note"),
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
      }),
    });
    const body = (await response.json()) as {
      ok?: boolean;
      error?: string;
      data?: InviteResult;
      rateLimited?: boolean;
      retryAfter?: number;
      cooldownUntil?: string;
    };
    if (response.status === 429 || body.rateLimited) {
      setError(
        `${body.error ?? "Zahteva trenutno ni mogoča."}${body.retryAfter ? ` Ponovni poskus čez ${body.retryAfter}s.` : ""}`,
      );
      return;
    }
    if (!response.ok || !body.ok || !body.data) {
      setError(body.error ?? "Povabila ni bilo mogoče pripraviti.");
      return;
    }
    setResult(body.data);
  }

  const link = result?.invite.inviteLink ?? "";
  const absolute = typeof window === "undefined" ? link : `${window.location.origin}${link}`;
  const notifications: NotificationPayload[] = result?.notifications ?? (result?.notification ? [result.notification] : []);

  return (
    <>
      <PageHeader title="Novo povabilo" description="Račun nastane šele po admin povabilu. Signup obrazca ni." />
      {error ? <ErrorState description={error} /> : null}
      {result ? (
        <SectionCard title="Povabilo pripravljeno">
          <div className="flex flex-wrap gap-2">
            {(result.deliveries ?? notifications).map((item) => (
              <StatusBadge key={`${item.channel}-${item.status}`} label={`${item.channel}: ${item.status}`} tone={statusTone(item.status)} />
            ))}
          </div>
          <p className={`mt-3 ${metaClass}`}>Ročno posredovanje: kopirajte povezavo, če dostava ni poslana.</p>
          <p className={`mt-2 break-all ${metaClass}`}>{absolute}</p>
          <FormActions>
            <button
              type="button"
              className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}
              onClick={() => {
                void copyValue(absolute).then(() => setCopied(true));
              }}
            >
              {copied ? "Kopirano" : "Kopiraj povezavo"}
            </button>
            <button
              type="button"
              className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
              onClick={async () => {
                const response = await fetch(`/api/admin/invites/${result.invite.id}/resend`, { method: "POST" });
                const body = (await response.json()) as { ok?: boolean; data?: InviteResult; error?: string; rateLimited?: boolean; retryAfter?: number };
                if (response.status === 429 || body.rateLimited) {
                  setError(`${body.error ?? "Zahteva trenutno ni mogoča."}${body.retryAfter ? ` Ponovni poskus čez ${body.retryAfter}s.` : ""}`);
                  return;
                }
                if (body.ok && body.data) {
                  setResult(body.data);
                  setCopied(false);
                }
              }}
            >
              Ponovno pošlji
            </button>
            <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)} onClick={() => router.push("/admin/users")}>
              Nazaj na seznam
            </button>
          </FormActions>
        </SectionCard>
      ) : (
        <form className="max-w-xl space-y-6" onSubmit={onSubmit}>
          <FormSection title="Prejemnik">
            <FormField id="firstName" label="Ime">
              <input id="firstName" name="firstName" className={fieldClass} />
            </FormField>
            <FormField id="lastName" label="Priimek">
              <input id="lastName" name="lastName" className={fieldClass} />
            </FormField>
            <FormField id="email" label="E-pošta">
              <input id="email" name="email" type="email" required className={fieldClass} />
            </FormField>
            <FormField id="department" label="Oddelek">
              <input id="department" name="department" className={fieldClass} />
            </FormField>
          </FormSection>
          <FormSection title="Dostop">
            <FormField id="role" label="Vloga">
              <select id="role" name="role" className={fieldClass} defaultValue={Role.EMPLOYEE}>
                {Object.values(Role)
                  .filter((role) => role !== Role.OWNER)
                  .map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField id="workspaceId" label="Delovni prostor">
              <input id="workspaceId" name="workspaceId" className={fieldClass} defaultValue="ws-demo" />
            </FormField>
            <FormField id="note" label="Opomba">
              <input id="note" name="note" className={fieldClass} />
            </FormField>
          </FormSection>
          <FormActions>
            <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
              Ustvari povabilo
            </button>
            <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)} onClick={() => router.push("/admin/users")}>
              Prekliči
            </button>
          </FormActions>
        </form>
      )}
    </>
  );
}

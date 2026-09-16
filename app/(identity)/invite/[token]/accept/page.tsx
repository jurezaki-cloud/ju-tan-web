"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import IdentityFrame from "@/components/identity/IdentityFrame";
import FormField from "@/components/platform/FormField";
import FormActions from "@/components/platform/FormActions";
import ErrorState from "@/components/platform/ErrorState";
import { fieldClass, ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const response = await fetch(`/api/invite/${params.token}/accept`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        password,
        confirmPassword,
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
      }),
    });
    const body = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !body.ok) {
      setError(body.error ?? "Povabilo ni veljavno.");
      return;
    }
    setSuccess(true);
    window.setTimeout(() => router.push("/login"), 1200);
  }

  if (success) {
    return (
      <IdentityFrame title="Račun je aktiven">
        <p className={metaClass}>Geslo je nastavljeno. Preusmeritev na prijavo…</p>
        <FormActions>
          <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)} onClick={() => router.push("/login")}>
            Prijava
          </button>
        </FormActions>
      </IdentityFrame>
    );
  }

  return (
    <IdentityFrame title="Nastavi geslo">
      {error ? <ErrorState description={error} /> : null}
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField id="firstName" label="Ime">
          <input id="firstName" name="firstName" className={fieldClass} />
        </FormField>
        <FormField id="lastName" label="Priimek">
          <input id="lastName" name="lastName" className={fieldClass} />
        </FormField>
        <FormField id="password" label="Geslo">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            className={fieldClass}
            onChange={(event) => {
              const value = event.target.value;
              setStrength(value.length >= 10 && /\d/.test(value) && /[A-Z]/.test(value) ? "močno" : value.length >= 8 ? "srednje" : "šibko");
            }}
          />
        </FormField>
        <p className={metaClass}>Moč gesla: {strength || "—"}</p>
        <FormField id="confirmPassword" label="Potrdi geslo">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            className={fieldClass}
          />
        </FormField>
        <label className={`flex min-h-11 items-center gap-2 ${metaClass}`}>
          <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
          Prikaži geslo
        </label>
        <FormActions>
          <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
            Aktiviraj račun
          </button>
        </FormActions>
      </form>
    </IdentityFrame>
  );
}

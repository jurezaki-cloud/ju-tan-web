"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { fieldClass, labelClass, ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";

export default function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    if (forgot) {
      await fetch("/api/identity/password/reset-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setNotice("Če račun obstaja, je zahteva zabeležena.");
      setPending(false);
      return;
    }
    const response = await fetch("/api/identity/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const body = (await response.json()) as { ok?: boolean; error?: string; home?: string };
    setPending(false);
    if (!response.ok || !body.ok) {
      setError(body.error ?? "Prijava ni uspela.");
      return;
    }
    router.replace(nextPath || body.home || "/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error ? (
        <p className="text-[14px] text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className={metaClass}>{notice}</p> : null}
      <div>
        <label className={labelClass} htmlFor="login-email">
          E-pošta
        </label>
        <input
          id="login-email"
          className={fieldClass}
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      {forgot ? null : (
        <div>
          <label className={labelClass} htmlFor="login-password">
            Geslo
          </label>
          <input
            id="login-password"
            className={fieldClass}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
      )}
      {forgot ? null : (
        <label className="flex items-center gap-2 text-[14px] text-slate-300 light:text-slate-700">
          <Checkbox
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
          />
          Zapomni si me
        </label>
      )}
      <button
        type="submit"
        className={cn(ctaBase, ctaSizes.default, ctaVariants.primary, "w-full")}
        disabled={pending}
      >
        {forgot ? "Pošlji zahtevo" : "Prijava"}
      </button>
      <button
        type="button"
        className={cn(metaClass, "underline")}
        onClick={() => {
          setForgot((current) => !current);
          setError(null);
          setNotice(null);
        }}
      >
        {forgot ? "Nazaj na prijavo" : "Forgot password"}
      </button>
    </form>
  );
}

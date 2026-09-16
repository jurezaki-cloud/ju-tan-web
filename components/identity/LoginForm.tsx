"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { fieldClass, labelClass, ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";

export default function LoginForm({
  nextPath,
  resetToken,
}: {
  nextPath?: string;
  resetToken?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [forgot, setForgot] = useState(Boolean(resetToken));
  const [token, setToken] = useState(resetToken ?? "");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const resetting = Boolean(token);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    if (resetting) {
      const response = await fetch("/api/identity/password/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      setPending(false);
      if (!response.ok) {
        setError("Zahteva ni veljavna.");
        return;
      }
      setNotice("Geslo je bilo nastavljeno. Prijavite se.");
      setToken("");
      setForgot(false);
      setPassword("");
      return;
    }
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
      {resetting ? (
        <div>
          <label className={labelClass} htmlFor="login-password">
            Novo geslo
          </label>
          <input
            id="login-password"
            className={fieldClass}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={4}
          />
        </div>
      ) : (
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
      )}
      {forgot || resetting ? null : (
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
      {forgot || resetting ? null : (
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
        {resetting ? "Nastavi geslo" : forgot ? "Pošlji zahtevo" : "Prijava"}
      </button>
      <button
        type="button"
        className={cn(metaClass, "underline")}
        onClick={() => {
          setForgot((current) => !current);
          setToken("");
          setError(null);
          setNotice(null);
        }}
      >
        {forgot || resetting ? "Nazaj na prijavo" : "Pozabljeno geslo"}
      </button>
    </form>
  );
}

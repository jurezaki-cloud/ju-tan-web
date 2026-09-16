"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/platform/auth/AuthContext";
import PageHeader from "@/components/platform/PageHeader";
import SectionCard from "@/components/platform/SectionCard";
import FormField from "@/components/platform/FormField";
import { fieldClass, labelClass, ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";
import { roleLabels } from "@/src/config/roles";

type SessionRow = {
  id: string;
  device: string;
  lastActivity: string;
  expiresAt: string;
};

export default function ProfileView() {
  const { session, refresh } = useAuth();
  const user = session.user;
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/identity/session")
      .then((response) => response.json())
      .then((body: { sessions?: SessionRow[] }) => setRows(body.sessions ?? []));
  }, []);

  async function onPassword(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    const response = await fetch("/api/identity/password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ current, next }),
    });
    const body = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok) {
      setMessage(body.error ?? "Gesla ni bilo mogoče spremeniti.");
      return;
    }
    setCurrent("");
    setNext("");
    setMessage("Geslo je posodobljeno.");
    await refresh();
  }

  if (!user) return null;

  return (
    <>
      <PageHeader title="Profil" description="Identiteta, vloga in seje." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Uporabnik">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 text-[16px] font-semibold text-[#16a34a] light:border-slate-200">
            {user.avatar}
          </div>
          <div className="space-y-4">
            <FormField id="profile-name" label="Ime" defaultValue={user.name} readOnly />
            <FormField id="profile-email" label="E-pošta" defaultValue={user.email} readOnly />
            <FormField id="profile-role" label="Vloga" defaultValue={roleLabels[user.role]} readOnly />
            <FormField
              id="profile-dept"
              label="Oddelek"
              defaultValue={user.department ?? ""}
              readOnly
            />
          </div>
          <Link href="/logout" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary, "mt-4")}>
            Odjava
          </Link>
        </SectionCard>

        <SectionCard title="Spremeni geslo">
          <form className="space-y-4" onSubmit={onPassword}>
            <div>
              <label className={labelClass} htmlFor="pw-current">
                Trenutno geslo
              </label>
              <input
                id="pw-current"
                className={fieldClass}
                type="password"
                autoComplete="current-password"
                value={current}
                onChange={(event) => setCurrent(event.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="pw-next">
                Novo geslo
              </label>
              <input
                id="pw-next"
                className={fieldClass}
                type="password"
                autoComplete="new-password"
                value={next}
                onChange={(event) => setNext(event.target.value)}
              />
            </div>
            {message ? <p className={metaClass}>{message}</p> : null}
            <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}>
              Shrani geslo
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Seje" className="lg:col-span-2">
          <ul className="space-y-3">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap justify-between gap-2">
                <span className="text-[14px] text-slate-300 light:text-slate-700">{row.device}</span>
                <span className={metaClass}>{row.lastActivity}</span>
              </li>
            ))}
            {rows.length === 0 ? <li className={metaClass}>Ni zabeleženih sej v pomnilniku.</li> : null}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}

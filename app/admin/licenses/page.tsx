"use client";
import {
  CalendarDays,
  Eye,
  KeyRound,
  Laptop,
  Radio,
  ShieldCheck,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import DataTable, { type DataColumn } from "@/components/platform/DataTable";
import PageHeader from "@/components/platform/PageHeader";
import StatsCard from "@/components/platform/StatsCard";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
type Row = {
  id: string;
  company_name: string;
  status: "active" | "expired" | "blocked";
  max_devices: number;
  valid_until: string | null;
  offline_grace_days: number;
  active_devices: number;
  last_seen_at: string | null;
  online: boolean;
  app_versions: string[];
  archived_at: string | null;
};
type Device = {
  id: string;
  device_id: string;
  app_version: string;
  activated_at: string;
  last_seen_at: string;
  deactivated_at: string | null;
  online: boolean;
};
type AuditEvent = { id: string; action: string; details: Record<string, unknown>; created_at: string };
type LicenseDetails = { license: Row; devices: Device[]; audit: AuditEvent[] };
type Backup = { id: string; created_at: string; licenses: number; activations: number; audit: number };
type Form = {
  company_name: string;
  max_devices: number;
  valid_until: string;
  offline_grace_days: number;
};
type VisitStats = {
  today: number;
  last_7_days: number;
  last_30_days: number;
  total: number;
};
const blank: Form = {
  company_name: "",
  max_devices: 1,
  valid_until: "",
  offline_grace_days: 7,
};
const input =
  "min-h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-white light:border-slate-300 light:bg-white light:text-slate-900";
const button =
  "min-h-10 rounded-lg border border-white/10 px-3 text-sm text-slate-200 hover:border-[#16a34a] light:border-slate-300 light:text-slate-700";
const dt = new Intl.DateTimeFormat("sl-SI", {
  dateStyle: "medium",
  timeStyle: "short",
});
export default function AdminLicensesPage() {
  const [rows, setRows] = useState<Row[] | null>(null),
    [error, setError] = useState<string | null>(null),
    [login, setLogin] = useState(false),
    [password, setPassword] = useState(""),
    [form, setForm] = useState<Form>(blank),
    [editing, setEditing] = useState<string | null>(null),
    [key, setKey] = useState<string | null>(null),
    [visits, setVisits] = useState<VisitStats | null>(null),
    [busy, setBusy] = useState(false),
    [details, setDetails] = useState<LicenseDetails | null>(null),
    [detailsBusy, setDetailsBusy] = useState(false),
    [backups, setBackups] = useState<Backup[] | null>(null),
    [backupBusy, setBackupBusy] = useState(false);
  const load = useCallback(async () => {
    const r = await fetch("/api/admin/licenses"),
      b = (await r.json()) as {
        items?: Row[];
        visits?: VisitStats;
        error?: string;
      };
    if (r.status === 401) {
      setLogin(true);
      return;
    }
    if (!r.ok || !b.items) {
      setError(b.error ?? "Licenc ni bilo mogoče naložiti.");
      return;
    }
    setRows(b.items);
    setVisits(b.visits ?? null);
    setError(null);
  }, []);
  useEffect(() => {
    const task = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(task);
  }, [load]);
  const request = async (
    method: string,
    body?: unknown,
    url = "/api/admin/licenses",
  ) => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(url, {
          method,
          headers: body ? { "content-type": "application/json" } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        }),
        b = (await r.json()) as { error?: string; license_key?: string };
      if (!r.ok) throw new Error(b.error ?? "Operacija ni uspela.");
      if (b.license_key) setKey(b.license_key);
      await load();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operacija ni uspela.");
      return false;
    } finally {
      setBusy(false);
    }
  };
  const loadBackups = async () => {
    const r = await fetch("/api/admin/license-backups", { cache: "no-store" });
    const b = (await r.json()) as { items?: Backup[]; error?: string };
    if (!r.ok) { setError(b.error ?? "Backupov ni bilo mogoče naložiti."); return; }
    setBackups(b.items ?? []);
  };
  const createBackup = async () => {
    setBackupBusy(true);
    try {
      const r = await fetch("/api/admin/license-backups", { method: "POST" });
      if (!r.ok) throw new Error("Backup ni uspel.");
      await loadBackups();
    } catch (e) { setError(e instanceof Error ? e.message : "Backup ni uspel."); }
    finally { setBackupBusy(false); }
  };
  const restoreBackup = async (id: string) => {
    if (!confirm("Obnovitev bo zamenjala trenutno stanje licenc in naprav. Pred obnovitvijo bo ustvarjena dodatna varnostna kopija. Nadaljujem?")) return;
    setBackupBusy(true);
    try {
      const r = await fetch("/api/admin/license-backups", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, confirm: "OBNOVI" }) });
      if (!r.ok) throw new Error("Obnovitev ni uspela.");
      await loadBackups(); await load(); setDetails(null);
    } catch (e) { setError(e instanceof Error ? e.message : "Obnovitev ni uspela."); }
    finally { setBackupBusy(false); }
  };
  const openDetails = async (row: Row) => {
    setDetailsBusy(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/licenses/${encodeURIComponent(row.id)}`);
      const b = (await r.json()) as LicenseDetails & { error?: string };
      if (!r.ok) throw new Error(b.error ?? "Podrobnosti ni bilo mogoče naložiti.");
      setDetails(b);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Podrobnosti ni bilo mogoče naložiti.");
    } finally {
      setDetailsBusy(false);
    }
  };
  const removeDevice = async (licenseId: string, activationId: string) => {
    if (!confirm("Odstranim to napravo iz licence?")) return;
    const ok = await request("DELETE", { activation_id: activationId }, `/api/admin/licenses/${encodeURIComponent(licenseId)}`);
    if (ok && details) await openDetails(details.license);
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const p = {
      ...form,
      valid_until: form.valid_until
        ? new Date(`${form.valid_until}T23:59:59Z`).toISOString()
        : null,
    };
    if (
      await request(
        editing ? "PATCH" : "POST",
        editing ? { id: editing, ...p } : p,
      )
    ) {
      setForm(blank);
      setEditing(null);
    }
  };
  const edit = (r: Row) => {
    setEditing(r.id);
    setForm({
      company_name: r.company_name,
      max_devices: r.max_devices,
      valid_until: r.valid_until?.slice(0, 10) ?? "",
      offline_grace_days: r.offline_grace_days,
    });
    scrollTo({ top: 0, behavior: "smooth" });
  };
  const stats = useMemo(() => {
    const a = rows ?? [];
    return {
      all: a.length,
      active: a.filter((x) => x.status === "active").length,
      devices: a.reduce((s, x) => s + x.active_devices, 0),
      online: a.filter((x) => x.online).length,
    };
  }, [rows]);
  const columns: DataColumn<Row>[] = [
    {
      key: "company_name",
      header: "Imetnik",
      sortable: true,
      render: (r) => (
        <b className="text-white light:text-slate-900">{r.company_name}</b>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <StatusBadge
          label={r.status === "active" ? "Aktivna" : r.status}
          tone={statusTone(r.status)}
        />
      ),
    },
    {
      key: "active_devices",
      header: "Naprave",
      render: (r) => `${r.active_devices} / ${r.max_devices}`,
    },
    {
      key: "online",
      header: "Povezava",
      render: (r) => (
        <StatusBadge
          label={r.online ? "Povezano" : "Brez povezave"}
          tone={r.online ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "last_seen_at",
      header: "Zadnja povezava",
      hideOnMobile: true,
      render: (r) =>
        r.last_seen_at ? dt.format(new Date(r.last_seen_at)) : "—",
    },
    {
      key: "actions",
      header: "Akcije",
      render: (r) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={button} disabled={detailsBusy} onClick={() => void openDetails(r)}>
            Podrobnosti
          </button>
          <button type="button" className={button} onClick={() => edit(r)}>
            Uredi
          </button>
          <button
            type="button"
            className={button}
            disabled={busy}
            onClick={() =>
              void request("PATCH", {
                id: r.id,
                action: "status",
                status: r.status === "blocked" ? "active" : "blocked",
              })
            }
          >
            {r.status === "blocked" ? "Aktiviraj" : "Blokiraj"}
          </button>
          <button
            type="button"
            className={button}
            disabled={busy || !r.active_devices}
            onClick={() =>
              confirm("Deaktiviram vse naprave?") &&
              void request("PATCH", { id: r.id, action: "deactivate_devices" })
            }
          >
            Ponastavi naprave
          </button>
          <button
            type="button"
            className={`${button} ${r.archived_at ? "text-emerald-400" : "text-amber-400"}`}
            disabled={busy}
            onClick={() =>
              confirm(r.archived_at ? `Obnovim licenco za ${r.company_name} iz arhiva?` : `Arhiviram licenco za ${r.company_name}? Aktivne naprave bodo deaktivirane.`) &&
              void request("PATCH", { id: r.id, action: r.archived_at ? "restore" : "archive" })
            }
          >
            {r.archived_at ? "Obnovi" : "Arhiviraj"}
          </button>
        </div>
      ),
    },
  ];
  if (login)
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#050816] px-4">
        <form
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] p-8"
          onSubmit={async (e) => {
            e.preventDefault();
            const r = await fetch("/api/license-admin/auth", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ password }),
            });
            if (!r.ok) {
              setError("Geslo ni pravilno.");
              return;
            }
            location.reload();
          }}
        >
          <h1 className="heading-display font-heading font-semibold text-white">
            Administracija licenc
          </h1>
          <input
            className={`${input} mt-6`}
            type="password"
            aria-label="Administratorsko geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Geslo"
            required
          />
          {error ? <p className="mt-3 text-red-400">{error}</p> : null}
          <button
            type="submit"
            className="mt-6 min-h-11 w-full rounded-lg bg-[#16a34a] font-semibold text-white"
          >
            Prijava
          </button>
        </form>
      </main>
    );
  return (
    <main className="min-h-dvh bg-[#050816] px-4 py-10 light:bg-slate-50">
      <div className="mx-auto max-w-[1400px]">
        <PageHeader
          title="Licence JU-TAN Office"
          description="Ustvarjanje, urejanje, blokiranje in nadzor aktivacij."
        />
        {visits ? (
          <section className="mb-8" aria-labelledby="site-visits-title">
            <h2
              id="site-visits-title"
              className="mb-4 text-lg font-semibold text-white light:text-slate-900"
            >
              Obiski spletne strani
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard
                label="Danes"
                value={String(visits.today)}
                icon={Eye}
              />
              <StatsCard
                label="Zadnjih 7 dni"
                value={String(visits.last_7_days)}
                icon={CalendarDays}
              />
              <StatsCard
                label="Zadnjih 30 dni"
                value={String(visits.last_30_days)}
                icon={CalendarDays}
              />
              <StatsCard
                label="Vsi obiski"
                value={String(visits.total)}
                icon={Eye}
              />
            </div>
          </section>
        ) : null}
        <form
          onSubmit={submit}
          className="mb-8 rounded-2xl border border-white/10 bg-[#0B1220] p-6 light:border-slate-200 light:bg-white"
        >
          <h2 className="text-lg font-semibold text-white light:text-slate-900">
            {editing ? "Uredi licenco" : "Nova licenca in generator ključa"}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <label className="text-sm text-slate-400">
              Imetnik
              <input
                className={`${input} mt-1`}
                value={form.company_name}
                onChange={(e) =>
                  setForm({ ...form, company_name: e.target.value })
                }
                required
              />
            </label>
            <label className="text-sm text-slate-400">
              Največ naprav
              <input
                className={`${input} mt-1`}
                type="number"
                min="1"
                max="100"
                value={form.max_devices}
                onChange={(e) =>
                  setForm({ ...form, max_devices: Number(e.target.value) })
                }
              />
            </label>
            <label className="text-sm text-slate-400">
              Velja do (prazno = neomejeno)
              <input
                className={`${input} mt-1`}
                type="date"
                value={form.valid_until}
                onChange={(e) =>
                  setForm({ ...form, valid_until: e.target.value })
                }
              />
            </label>
            <label className="text-sm text-slate-400">
              Dni brez povezave
              <input
                className={`${input} mt-1`}
                type="number"
                min="0"
                max="30"
                value={form.offline_grace_days}
                onChange={(e) =>
                  setForm({
                    ...form,
                    offline_grace_days: Number(e.target.value),
                  })
                }
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 rounded-lg bg-[#16a34a] px-5 font-semibold text-white"
            >
              {editing ? "Shrani spremembe" : "Ustvari licenco in ključ"}
            </button>
            {editing ? (
              <button
                type="button"
                className={button}
                onClick={() => {
                  setEditing(null);
                  setForm(blank);
                }}
              >
                Prekliči
              </button>
            ) : null}
          </div>
        </form>
        {key ? (
          <div className="mb-8 rounded-2xl border border-[#16a34a] bg-[#16a34a]/10 p-6">
            <p className="text-slate-300">
              Ključ se prikaže samo zdaj. Takoj ga kopiraj.
            </p>
            <code className="mt-3 block break-all text-lg font-semibold text-white">
              {key}
            </code>
            <button
              type="button"
              className={`${button} mt-4`}
              onClick={() => void navigator.clipboard.writeText(key)}
            >
              Kopiraj ključ
            </button>
          </div>
        ) : null}
        {error ? (
          <p className="mb-6 rounded-lg border border-red-400/40 p-4 text-red-400">
            {error}
          </p>
        ) : null}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Vse licence"
            value={String(stats.all)}
            icon={KeyRound}
          />
          <StatsCard
            label="Aktivne licence"
            value={String(stats.active)}
            icon={ShieldCheck}
          />
          <StatsCard
            label="Aktivne naprave"
            value={String(stats.devices)}
            icon={Laptop}
          />
          <StatsCard
            label="Povezane"
            value={String(stats.online)}
            icon={Radio}
          />
        </div>
        {details ? (
          <section className="mb-8 rounded-2xl border border-[#16a34a]/40 bg-[#0B1220] p-6 light:bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white light:text-slate-900">Podrobnosti licence — {details.license.company_name}</h2>
                <p className="mt-1 text-sm text-slate-400">Aktivne naprave {details.devices.filter((d) => !d.deactivated_at).length} / {details.license.max_devices}</p>
              </div>
              <button type="button" className={button} onClick={() => setDetails(null)}>Zapri</button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-slate-400"><tr><th className="p-3">Naprava</th><th className="p-3">Verzija</th><th className="p-3">Aktivirana</th><th className="p-3">Zadnja povezava</th><th className="p-3">Status</th><th className="p-3">Akcija</th></tr></thead>
                <tbody>
                  {details.devices.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 text-slate-200 light:text-slate-700">
                      <td className="p-3 font-mono">…{d.device_id}</td>
                      <td className="p-3">{d.app_version}</td>
                      <td className="p-3">{dt.format(new Date(d.activated_at))}</td>
                      <td className="p-3">{dt.format(new Date(d.last_seen_at))}</td>
                      <td className="p-3"><StatusBadge label={d.deactivated_at ? "Odstranjena" : d.online ? "Povezana" : "Brez povezave"} tone={d.deactivated_at ? "neutral" : d.online ? "success" : "neutral"} /></td>
                      <td className="p-3">{!d.deactivated_at ? <button type="button" className={`${button} text-red-400`} disabled={busy} onClick={() => void removeDevice(details.license.id, d.id)}>Odstrani napravo</button> : "—"}</td>
                    </tr>
                  ))}
                  {!details.devices.length ? <tr><td colSpan={6} className="p-6 text-center text-slate-400">Na tej licenci še ni aktiviranih naprav.</td></tr> : null}
                </tbody>
              </table>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white light:text-slate-900">Zgodovina sprememb</h3>
              <div className="mt-3 space-y-2">
                {details.audit?.map((event) => {
                  const labels: Record<string, string> = {
                    license_created: "Licenca ustvarjena",
                    license_updated: "Licenca urejena",
                    license_blocked: "Licenca blokirana",
                    license_activated: "Licenca aktivirana",
                    license_archived: "Licenca arhivirana",
                    license_restored: "Licenca obnovljena iz arhiva",
                    device_activated: "Naprava aktivirana",
                    device_removed: "Naprava odstranjena",
                    devices_reset: "Vse naprave ponastavljene",
                  };
                  return <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3">
                    <span className="text-sm font-medium text-slate-200 light:text-slate-700">{labels[event.action] ?? event.action}</span>
                    <time className="text-xs text-slate-400">{dt.format(new Date(event.created_at))}</time>
                  </div>;
                })}
                {!details.audit?.length ? <p className="text-sm text-slate-400">Zgodovine še ni.</p> : null}
              </div>
            </div>
          </section>
        ) : null}
        <section className="mb-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5 light:border-slate-200 light:bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-lg font-semibold text-white light:text-slate-900">Varnostne kopije</h2><p className="mt-1 text-sm text-slate-400">Licence, naprave in zgodovina sprememb.</p></div>
            <div className="flex gap-2"><button type="button" className={button} onClick={() => void loadBackups()} disabled={backupBusy}>Prikaži backupe</button><button type="button" className={button} onClick={() => void createBackup()} disabled={backupBusy}>{backupBusy ? "Počakaj…" : "Ustvari backup"}</button></div>
          </div>
          {backups ? <div className="mt-4 space-y-2">{backups.map((b) => <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3"><div><div className="text-sm font-medium text-slate-200 light:text-slate-700">{dt.format(new Date(b.created_at))}</div><div className="text-xs text-slate-400">{b.licenses} licenc · {b.activations} naprav · {b.audit} dogodkov</div></div><button type="button" className={button} onClick={() => void restoreBackup(b.id)} disabled={backupBusy}>Obnovi</button></div>)}{!backups.length ? <p className="text-sm text-slate-400">Backupov še ni.</p> : null}</div> : null}
        </section>
        {rows ? (
          <DataTable
            rows={rows}
            columns={columns}
            caption="Licence"
            searchKeys={["company_name", "status"]}
            pageSize={10}
          />
        ) : (
          <p className="text-slate-400">Nalaganje …</p>
        )}
      </div>
    </main>
  );
}

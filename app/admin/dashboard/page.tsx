"use client";
import { useEffect,useState } from "react";
import { Activity,AlertTriangle,Archive,Eye,KeyRound,Laptop,Radio,ShieldCheck } from "lucide-react";
import PageHeader from "@/components/platform/PageHeader";
import StatsCard from "@/components/platform/StatsCard";
type Stats={licenses:number;active_licenses:number;archived:number;devices:number;online:number;new_devices:number;alerts:number;visits:{today:number;last_7_days:number;last_30_days:number;total:number};last_backup_at:string|null};
const box="rounded-xl border border-white/10 bg-white/[0.03] p-5 light:border-slate-200 light:bg-white";
export default function AdminDashboardPage(){
 const [s,setS]=useState<Stats|null>(null);const [error,setError]=useState<string|null>(null);
 useEffect(()=>{void(async()=>{const r=await fetch("/api/admin/dashboard",{cache:"no-store"});const b=await r.json();if(!r.ok){setError(b.error??"Napaka pri nalaganju.");return;}setS(b.stats);})()},[]);
 return <main className="space-y-6"><PageHeader title="JU-TAN nadzorna plošča" description="Pregled licenc, naprav, obiska, opozoril in varnostnih kopij."/>
 {error&&<div className={box}>{error}</div>}{!s?<div className={box}>Nalagam podatke …</div>:<>
 <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 <StatsCard label="Licence" value={s.licenses} icon={KeyRound}/><StatsCard label="Aktivne licence" value={s.active_licenses} icon={ShieldCheck}/><StatsCard label="Aktivne naprave" value={s.devices} icon={Laptop}/><StatsCard label="Online" value={s.online} icon={Radio}/>
 </section><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 <StatsCard label="Obiski danes" value={s.visits.today} icon={Eye}/><StatsCard label="Obiski 30 dni" value={s.visits.last_30_days} icon={Activity}/><StatsCard label="Nove naprave 24 h" value={s.new_devices} icon={Laptop}/><StatsCard label="Opozorila" value={s.alerts} icon={AlertTriangle}/>
 </section><section className="grid gap-4 lg:grid-cols-3">
 <div className={box}><h2 className="font-semibold text-white light:text-slate-900">Obisk strani</h2><p className="mt-3 text-sm text-slate-400">7 dni: {s.visits.last_7_days.toLocaleString("sl-SI")} · skupaj: {s.visits.total.toLocaleString("sl-SI")}</p></div>
 <div className={box}><h2 className="font-semibold text-white light:text-slate-900">Varnostna kopija</h2><p className="mt-3 text-sm text-slate-400">{s.last_backup_at?new Intl.DateTimeFormat("sl-SI",{dateStyle:"medium",timeStyle:"short"}).format(new Date(s.last_backup_at)):"Backup še ni na voljo."}</p></div>
 <div className={box}><h2 className="font-semibold text-white light:text-slate-900">Arhiv</h2><p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><Archive size={16}/>{s.archived} arhiviranih licenc</p></div>
 </section><a href="/admin/licenses" className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-4 text-sm text-slate-200 hover:border-[#16a34a] light:border-slate-300 light:text-slate-700">Odpri upravljanje licenc →</a></>}</main>
}
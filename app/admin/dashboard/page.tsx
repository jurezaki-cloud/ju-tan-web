"use client";
import { useEffect,useState } from "react";
import { Activity,AlertTriangle,Archive,Eye,KeyRound,Laptop,Radio,ShieldCheck } from "lucide-react";
import PageHeader from "@/components/platform/PageHeader";
import StatsCard from "@/components/platform/StatsCard";
type Stats={licenses:number;active_licenses:number;archived:number;devices:number;online:number;new_devices:number;alerts:number;visits:{today:number;last_7_days:number;last_30_days:number;total:number};last_backup_at:string|null;downloads:{today:number;last_30_days:number;total:number};analytics:{days:number;daily:{day:string;visits:number}[];top_pages:{path:string;visits:number}[]}};
const box="rounded-xl border border-white/10 bg-white/[0.03] p-5 light:border-slate-200 light:bg-white";
export default function AdminDashboardPage(){
 const [s,setS]=useState<Stats|null>(null);const [error,setError]=useState<string|null>(null);
 useEffect(()=>{void(async()=>{const r=await fetch("/api/admin/dashboard",{cache:"no-store"});const b=await r.json();if(!r.ok){setError(b.error??"Napaka pri nalaganju.");return;}setS(b.stats);})()},[]);
 return <main className="space-y-6"><PageHeader title="JU-TAN nadzorna plošča" description="Pregled licenc, naprav, obiska, opozoril in varnostnih kopij."/>
 {error&&<div className={box}>{error}</div>}{!s?<div className={box}>Nalagam podatke …</div>:<>
 <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 <StatsCard label="Licence" value={String(s.licenses)} icon={KeyRound}/><StatsCard label="Aktivne licence" value={String(s.active_licenses)} icon={ShieldCheck}/><StatsCard label="Aktivne naprave" value={String(s.devices)} icon={Laptop}/><StatsCard label="Online" value={String(s.online)} icon={Radio}/>
 </section><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 <StatsCard label="Obiski danes" value={String(s.visits.today)} icon={Eye}/><StatsCard label="Obiski 30 dni" value={String(s.visits.last_30_days)} icon={Activity}/><StatsCard label="Nove naprave 24 h" value={String(s.new_devices)} icon={Laptop}/><StatsCard label="Opozorila" value={String(s.alerts)} icon={AlertTriangle}/><StatsCard label="Prenosi danes" value={String(s.downloads.today)} icon={Activity}/><StatsCard label="Prenosi 30 dni" value={String(s.downloads.last_30_days)} icon={Activity}/>
 </section><section className="grid gap-4 lg:grid-cols-3">
 <div className={box}><h2 className="font-semibold text-white light:text-slate-900">Obisk strani</h2><p className="mt-3 text-sm text-slate-400">7 dni: {s.visits.last_7_days.toLocaleString("sl-SI")} · skupaj: {s.visits.total.toLocaleString("sl-SI")}</p></div>
 <div className={box}><h2 className="font-semibold text-white light:text-slate-900">Varnostna kopija</h2><p className="mt-3 text-sm text-slate-400">{s.last_backup_at?new Intl.DateTimeFormat("sl-SI",{dateStyle:"medium",timeStyle:"short"}).format(new Date(s.last_backup_at)):"Backup še ni na voljo."}</p></div>
 <div className={box}><h2 className="font-semibold text-white light:text-slate-900">Arhiv</h2><p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><Archive size={16}/>{s.archived} arhiviranih licenc</p></div>
 </section>
 <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
  <div className={box}><div className="flex items-center justify-between"><h2 className="font-semibold text-white light:text-slate-900">Obiski zadnjih 90 dni</h2><span className="text-xs text-slate-500">dnevni ogledi</span></div>
   <div className="mt-5 flex h-48 items-end gap-[2px]">{s.analytics.daily.length?s.analytics.daily.map((d)=>{const max=Math.max(...s.analytics.daily.map(x=>x.visits),1);return <div key={d.day} className="group relative min-w-0 flex-1 rounded-t bg-[#16a34a]/70" style={{height:`${Math.max(4,(d.visits/max)*100)}%`}} title={`${d.day}: ${d.visits}`}><span className="sr-only">{d.day}: {d.visits}</span></div>}):<p className="self-center text-sm text-slate-400">Podatki se bodo prikazali po prvih obiskih.</p>}</div>
  </div>
  <div className={box}><h2 className="font-semibold text-white light:text-slate-900">Najbolj obiskane strani</h2><div className="mt-4 space-y-3">{s.analytics.top_pages.length?s.analytics.top_pages.map((p,i)=><div key={p.path} className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate text-slate-300 light:text-slate-700">{i+1}. {p.path}</span><strong className="tabular-nums text-white light:text-slate-900">{p.visits.toLocaleString("sl-SI")}</strong></div>):<p className="text-sm text-slate-400">Statistika strani se od uvedbe naprej šele zbira.</p>}</div></div>
 </section><a href="/admin/licenses" className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-4 text-sm text-slate-200 hover:border-[#16a34a] light:border-slate-300 light:text-slate-700">Odpri upravljanje licenc →</a></>}</main>
}
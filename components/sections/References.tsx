import Link from "next/link";
import Section from "@/components/common/Section";

const projects = [
  { title: "Tanjina lučka upanja", type: "Spletna stran fundacije", text: "Celostna digitalna predstavitev fundacije za pomoč družinam in posameznikom v stiski — od uporabniške izkušnje do objave.", href: "https://tanjinaluckaupanja.si", tags: ["UI/UX", "Spletni razvoj", "Responsive"] },
  { title: "KampRadar", type: "Spletni portal", text: "Sodoben večjezični portal za raziskovanje kampov z iskanjem, zemljevidi, profili kampov in zaupanja vredno predstavitvijo podatkov.", href: "https://kampradar.si", tags: ["Portal", "UI/UX", "Zemljevidi", "Več jezikov"] },
  { title: "JU-TAN Office", type: "Lasten programski izdelek", text: "Slovenski poslovni program za Windows za račune, ponudbe, stranke, plačila, artikle, zalogo in pregled poslovanja.", href: "/ju-tan-office", tags: ["Windows", "Python", "PySide6", "Poslovanje"] },
] as const;

export default function References({ full = false }: { full?: boolean }) {
  return (
    <Section labelledBy="references-title" className="bg-[#050816] light:bg-slate-50">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">REFERENCE JU-TAN</p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 id="references-title" className={`${full ? "heading-hero" : "heading-display"} font-heading font-semibold`}>{full ? "Projekti, ki govorijo za naše delo." : "Izbrani projekti"}</h1>
            <p className="mt-4 max-w-2xl text-slate-400 light:text-slate-600">Od spletnih strani in portalov do lastne poslovne programske opreme. Načrtujemo, oblikujemo, razvijamo in objavimo celotno rešitev.</p>
          </div>
          {!full && <Link href="/reference" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">Vse reference →</Link>}
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {projects.map((project) => {
            const body = (
              <>
                <div className="flex items-center justify-between gap-3"><span className="text-xs uppercase tracking-[0.16em] text-emerald-400">{project.type}</span><span aria-hidden>↗</span></div>
                <h2 className="mt-6 font-heading text-2xl font-semibold">{project.title}</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-slate-400 light:text-slate-600">{project.text}</p>
                <div className="mt-6 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 light:border-slate-200 light:text-slate-600">{tag}</span>)}</div>
              </>
            );
            const cls = "group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_70px_rgba(22,163,74,.12)] light:border-slate-200 light:bg-white";
            return project.href.startsWith("http")
              ? <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
              : <Link key={project.title} href={project.href} className={cls}>{body}</Link>;
          })}
        </div>
      </div>
    </Section>
  );
}

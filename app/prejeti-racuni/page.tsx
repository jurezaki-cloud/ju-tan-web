import type { Metadata } from "next";
import { ArrowDownToLine, Check, FileArchive, Files, Mail, ScanLine } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/common/Section";
import { bodyClass, ctaBase, ctaSizes, ctaVariants, kickerClass } from "@/design";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const path = "/prejeti-racuni";
const downloadPath = "/downloads/ju-tan-prejeti-racuni.apk";
const features = [
  { icon: ScanLine, title: "Več strani v enem računu", text: "Fotografiraj vse strani zaporedoma in shrani račun kot en večstranski PDF." },
  { icon: Files, title: "Mesečna zbirka", text: "Račune razvrsti po mesecih, jih odpri za predogled in označi kot pregledane." },
  { icon: FileArchive, title: "ZIP za računovodstvo", text: "Pripravi mesečni paket z računi in pregledno CSV evidenco." },
  { icon: Mail, title: "Pošlji po e-pošti", text: "Izberi e-poštno aplikacijo in pošlji račune računovodstvu neposredno iz telefona." },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Zbirnik prejetih računov za Android",
  description: "Brezplačna JU-TAN Android aplikacija za mesečno zbiranje prejetih računov, večstransko skeniranje, predogled, ZIP izvoz in pošiljanje računovodstvu.",
  path,
});

export default function PrejetiRacuniPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Section labelledBy="invoice-app-title" className="bg-[#050816] light:bg-slate-50">
          <div className="mx-auto max-w-[58rem] pt-4 sm:pt-8">
            <p className={cn(kickerClass, "light:text-slate-500")}>JU-TAN STUDIO · ANDROID APLIKACIJA</p>
            <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <h1 id="invoice-app-title" className="heading-hero font-heading font-semibold text-white light:text-slate-900">
                  Prejeti računi.<br /><span className="text-[#16a34a]">Urejeni vsak mesec.</span>
                </h1>
                <p className={cn(bodyClass, "mt-6 max-w-[42rem] light:text-slate-600")}>
                  Fotografiraj račune, združi več strani v en dokument in jih ob koncu meseca pripravi za računovodstvo — vse v telefonu.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a href={downloadPath} download="JU-TAN-Prejeti-Racuni-1.4.0.apk" className={cn(ctaBase, ctaSizes.default, ctaVariants.primary)}>
                    <ArrowDownToLine aria-hidden="true" className="h-4 w-4" /> Prenesi APK za Android
                  </a>
                  <span className="text-[12px] text-slate-500">Različica 1.4.0 · 2,3 MB</span>
                </div>
                <p className="mt-4 max-w-[45rem] text-[12px] leading-6 text-slate-500">
                  Aplikacija je namenjena telefonu Android. Po prenosu odpri datoteko APK in potrdi namestitev, če telefon to zahteva.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-[#0d261d] via-[#122f25] to-[#1d4732] p-6 shadow-2xl sm:p-8">
                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/10 shadow-[0_0_0_24px_rgba(255,255,255,0.025),0_0_0_52px_rgba(255,255,255,0.02)]" aria-hidden="true" />
                <div className="relative rounded-2xl bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">JU-TAN STUDIO</p><p className="mt-1 text-sm font-bold text-slate-900">Prejeti računi</p></div>
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold capitalize text-emerald-800">Oktober 2026</span>
                  </div>
                  <div className="py-5"><p className="text-[10px] font-semibold tracking-wide text-slate-500">SKUPAJ V TEM MESECU</p><p className="mt-1 text-3xl font-bold tracking-tight text-[#173b2e]">1.248,60 €</p><div className="mt-3 flex gap-2"><span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-600"><b className="text-slate-900">8</b> računov</span><span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-600"><b className="text-slate-900">5/8</b> pregledanih</span></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[62%] rounded-full bg-emerald-600" /></div></div>
                  <div className="rounded-xl border border-slate-100 p-3"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Files className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800">Dobavitelj d.o.o.</p><p className="mt-1 text-[10px] text-slate-500">Račun · 3 strani · pregledan</p></div><span className="text-xs font-semibold text-slate-800">245,90 €</span></div></div>
                </div>
                <p className="relative mt-4 text-center text-[10px] tracking-wide text-emerald-100/70">Pregleden mesečni arhiv v tvojem telefonu</p>
              </div>
            </div>
          </div>
        </Section>

        <Section belowFold labelledBy="invoice-app-features" className="bg-[#050816] light:bg-slate-50">
          <div className="mx-auto max-w-[58rem]">
            <div className="max-w-[40rem]"><p className={cn(kickerClass, "light:text-slate-500")}>PREPROST POSTOPEK</p><h2 id="invoice-app-features" className="heading-display mt-4 font-heading font-semibold text-white light:text-slate-900">Od fotografije do mesečne oddaje.</h2><p className={cn(bodyClass, "mt-4 light:text-slate-600")}>Vse, kar potrebuješ za urejeno zbiranje računov na poti.</p></div>
            <ul className="mt-9 grid gap-4 sm:grid-cols-2">{features.map(({ icon: Icon, title, text }) => <li key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 light:border-slate-200 light:bg-white"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#16a34a]/10 text-[#16a34a]"><Icon className="h-5 w-5" aria-hidden="true" /></span><h3 className="mt-4 font-heading text-lg font-semibold text-white light:text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400 light:text-slate-600">{text}</p></li>)}</ul>
            <div className="mt-7 flex gap-3 rounded-2xl border border-[#16a34a]/20 bg-[#16a34a]/[0.06] p-5 text-sm leading-6 text-slate-300 light:text-slate-700"><Check className="mt-1 h-4 w-4 shrink-0 text-[#16a34a]" aria-hidden="true" /><p>Dokumenti se hranijo lokalno v telefonu. Pred pošiljanjem lahko preveriš dodane račune in vse strani PDF dokumenta.</p></div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

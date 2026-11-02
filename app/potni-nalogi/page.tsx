import type { Metadata } from "next";
import { ArrowDownToLine, Camera, FileArchive, Mail, RotateCw, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/common/Section";
import { bodyClass, kickerClass } from "@/design";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: "Pošlji potne naloge – aplikacija za Android",
  description: "Poslikajte podpisane potne naloge, uredite strani in pripravite ZIP za računovodstvo. Prenesite Android aplikacijo Pošlji potne naloge za JU-TAN Studio.",
  path: "/potni-nalogi",
});

const features = [
  { icon: Camera, title: "Več strani, en paket", text: "Fotografirajte natisnjene in podpisane naloge ali uvozite fotografije iz telefona. Dodate lahko do 40 strani." },
  { icon: RotateCw, title: "Preglejte in uredite", text: "Zavrtite strani, obrežite robove, uporabite črno-beli način ali odstranite napačno fotografijo." },
  { icon: FileArchive, title: "Pregledna zgodovina", text: "Fotografije združite v ZIP. Shranjeni paketi ostanejo v lokalni zgodovini za poznejše deljenje ali brisanje." },
  { icon: Mail, title: "Pripravljen dopis", text: "Nastavite e-naslov računovodstva, zadevo in besedilo. Izberite e-poštno aplikacijo ter v njej potrdite pošiljanje." },
] as const;

const steps = [
  ["01", "Poslikajte", "Podpisane naloge zajemite stran za stranjo. Pred oddajo preverite berljivost besedila in podpisov."],
  ["02", "Pripravite ZIP", "Preglejte fotografije in ustvarite paket. Osnutek in že pripravljeni paketi se shranjujejo ločeno."],
  ["03", "Pošljite", "Odprite deljenje, izberite e-poštno aplikacijo in preverite prejemnika ter priponko. Nato potrdite pošiljanje."],
] as const;

export default function PotniNalogiPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Section labelledBy="travel-app-title" className="bg-[#0a1528] light:bg-slate-50">
          <div className="mx-auto max-w-[64rem] pt-4 sm:pt-8">
            <p className={cn(kickerClass, "text-[#37d8c3] light:text-teal-700")}>JU-TAN STUDIO · ANDROID APLIKACIJA</p>
            <div className="mt-6 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <h1 id="travel-app-title" className="heading-hero font-heading font-semibold text-white light:text-slate-900">
                  Pošlji potne naloge.<br /><span className="text-[#37d8c3] light:text-teal-700">Papirji, urejeni.</span>
                </h1>
                <p className={cn(bodyClass, "mt-6 light:text-slate-600")}>
                  Naloge že imate natisnjene in podpisane. Poslikajte jih, uredite strani in pripravite en ZIP paket za računovodstvo — neposredno v telefonu.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="/downloads/poslji-potne-naloge-1.0.0.apk" download="Poslji-potne-naloge-1.0.0.apk" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#37d8c3] px-6 py-3 text-sm font-semibold text-[#0a1528] transition-colors hover:bg-teal-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400">
                    <ArrowDownToLine aria-hidden="true" className="h-4 w-4" /> Prenesi APK za Android
                  </a>
                  <span className="text-xs leading-6 text-slate-300 light:text-slate-600">1.0.0 · 0,81 MB<br />Android 8.0 ali novejši</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400 light:text-slate-600">
                  Preizkusna različica, razvojno podpisana. Na voljo kot neposreden prenos APK-ja, ne prek Google Play. Delovanje na telefonu še ni potrjeno z end-to-end preizkusom.
                </p>
              </div>
              <div className="rounded-[2rem] border border-teal-300/20 bg-gradient-to-br from-[#14243b] to-[#123a43] p-7 shadow-2xl sm:p-9">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#37d8c3]">PODPISANO. POSLIKANO.</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-white">Pripravljeno za<br />računovodstvo.</p>
                <div className="mt-8 space-y-3" aria-hidden="true">
                  {["Podpisan potni nalog", "Priloge in dokazila", "Enoten ZIP paket"].map((label, index) => (
                    <div key={label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0a1528]/60 p-4">
                      <span className="text-sm font-semibold text-[#37d8c3]">0{index + 1}</span><span className="text-sm text-slate-100">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 flex items-center gap-2 text-sm text-teal-100"><ShieldCheck className="h-5 w-5" aria-hidden="true" /> Lokalna hramba. Brez uporabniškega računa.</p>
              </div>
            </div>
          </div>
        </Section>
        <Section belowFold labelledBy="travel-features" className="bg-[#0a1528] light:bg-slate-50">
          <div className="mx-auto max-w-[64rem]">
            <h2 id="travel-features" className="heading-display font-heading font-semibold text-white light:text-slate-900">Od podpisanega lista do urejenega paketa.</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 light:border-slate-200 light:bg-white">
                  <Icon className="h-6 w-6 text-[#37d8c3] light:text-teal-700" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-white light:text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 light:text-slate-600">{text}</p>
                </li>
              ))}
            </ul>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map(([number, title, text]) => (
                <li key={number} className="border-t border-teal-400/30 pt-5">
                  <p className="text-sm text-[#37d8c3] light:text-teal-700">{number}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white light:text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 light:text-slate-600">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>
        <Section belowFold labelledBy="travel-install" className="bg-[#0a1528] light:bg-slate-50">
          <div className="mx-auto grid max-w-[64rem] gap-8 md:grid-cols-2">
            <div>
              <h2 id="travel-install" className="text-2xl font-semibold text-white light:text-slate-900">Prvi zagon v nekaj korakih.</h2>
              <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-300 light:text-slate-600">
                <li>Prenesite APK na telefon in odprite datoteko. Po potrebi dovolite namestitev iz uporabljene aplikacije za datoteke.</li>
                <li>V nastavitvah aplikacije vnesite e-naslov računovodstva in shranite. Zadeva in besedilo sta že pripravljena.</li>
                <li>Dodajte prve strani in preizkusite pripravo ter deljenje paketa. Velikost priponk omejuje vaš e-poštni ponudnik.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 light:border-slate-200">
              <h2 className="text-xl font-semibold text-white light:text-slate-900">Vaši dokumenti ostanejo pri vas.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 light:text-slate-600">Osnutki in paketi se hranijo v zasebni shrambi aplikacije. Aplikacija nima dostopa do interneta; dokumente deli šele po vaši izbiri. ZIP ni zaščiten z geslom. Odstranitev aplikacije izbriše lokalne podatke.</p>
              <p className="mt-4 text-sm leading-7 text-slate-300 light:text-slate-600">Pošiljanje potrdite v e-poštni aplikaciji. Zgodovina ne potrjuje dostave. Samodejno pošiljanje prek strežnika ali OAuth v tej različici ni vključeno.</p>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

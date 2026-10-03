import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/common/Section";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Grafično oblikovanje | Logotipi, celostne podobe, letaki in dizajn",
  description: "Profesionalno in hitro grafično oblikovanje JU-TAN Studio: logotipi, celostne grafične podobe, letaki, vizitke, predloge, promocijski materiali in digitalni dizajn.",
  path: "/graficno-oblikovanje",
});

const services = [
  ["Logotipi", "Prepoznaven znak in tipografski sistem, pripravljen za splet, tisk in družbena omrežja."],
  ["Celostna grafična podoba", "Barve, tipografija, pravila uporabe in vizualni jezik, ki podjetje poveže v prepoznavno celoto."],
  ["Letaki in promocijski materiali", "Jasne, prodajno usmerjene kompozicije za tiskane in digitalne kampanje."],
  ["Vizitke in poslovne predloge", "Usklajeni dokumenti, predstavitve in materiali za profesionalen vsakodnevni nastop."],
  ["Digitalni dizajn", "Grafike za splet, družbena omrežja, oglase, pasice in druge digitalne formate."],
  ["Priprava za tisk", "Pravilni formati, dimenzije in izvoz datotek za zanesljivo izvedbo pri tiskarju."],
] as const;

export default function GraphicDesignPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-24">
        <Section labelledBy="graphics-title" className="overflow-hidden bg-[#050816] light:bg-slate-50">
          <div className="relative mx-auto max-w-6xl py-8 sm:py-14">
            <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">JU-TAN CREATIVE STUDIO</p>
            <h1 id="graphics-title" className="heading-hero mt-5 max-w-4xl font-heading font-semibold text-white light:text-slate-900">
              Grafika, ki podjetju da obraz.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 light:text-slate-600">
              Profesionalna in hitra izdelava logotipov, celostnih grafičnih podob, letakov, vizitk, predlog in digitalnih dizajnov. Od prve ideje do datotek, pripravljenih za splet ali tisk.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/kontakt" className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">Želim grafično rešitev</Link>
              <Link href="#storitve" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/50 light:border-slate-300 light:text-slate-900">Poglejte možnosti</Link>
            </div>
            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              {["LOGOTIP · IDENTITETA", "TISK · PROMOCIJA", "DIGITAL · DESIGN"].map((x) => <div key={x} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center text-xs font-semibold tracking-[0.18em] text-emerald-400 light:border-slate-200 light:bg-white">{x}</div>)}
            </div>
          </div>
        </Section>
        <Section id="storitve" labelledBy="graphics-services" className="bg-[#050816] light:bg-slate-50">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">VSE NA ENEM MESTU</p>
            <h2 id="graphics-services" className="heading-display mt-4 max-w-3xl font-heading font-semibold text-white light:text-slate-900">Od ideje do prepoznavne vizualne podobe.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map(([title,text],i)=><article key={title} className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-500/40 light:border-slate-200 light:bg-white"><span className="text-xs font-semibold text-emerald-400">0{i+1}</span><h3 className="mt-5 font-heading text-xl font-semibold text-white light:text-slate-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">{text}</p></article>)}
            </div>
          </div>
        </Section>
        <Section labelledBy="graphics-process" className="bg-[#050816] light:bg-slate-50">
          <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">HITRO · UREJENO · PROFESIONALNO</p>
            <h2 id="graphics-process" className="heading-display mt-4 font-heading font-semibold text-white light:text-slate-900">Povejte, kaj potrebujete. Mi oblikujemo vizualno rešitev.</h2>
            <p className="mt-4 max-w-2xl text-slate-300 light:text-slate-600">Pripravimo smer, oblikujemo rešitev in jo predamo v uporabnih formatih. Za nov logotip, osvežitev podobe ali posamezen promocijski material.</p>
            <Link href="/kontakt" className="mt-7 inline-flex rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">Začnimo projekt</Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

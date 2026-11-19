import Link from "next/link";
import { ArrowUpRight, Files, Smartphone, FolderArchive } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/common/Section";
import { bodyClass, kickerClass } from "@/design";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Brezplačne Android aplikacije za podjetja",
  description: "Brezplačni Android aplikaciji JU-TAN za podjetja: Prejeti računi in Pošlji potne naloge. Predstavitve, navodila in prenosi APK na enem mestu.",
  path: "/free-apk-za-podjetja",
});

const apps = [
  {
    title: "Prejeti računi za Android",
    href: "/prejeti-racuni",
    icon: Files,
    description: "Fotografiraj večstranske račune, uredi mesečno zbirko ter pripravi PDF, ZIP in CSV za računovodstvo.",
    note: "Računi, pregledno urejeni po mesecih.",
  },
  {
    title: "Pošlji potne naloge za Android",
    href: "/potni-nalogi",
    icon: FolderArchive,
    description: "Poslikaj že podpisane potne naloge, uredi strani in pripravi ZIP paket za pošiljanje računovodstvu.",
    note: "Preizkusna različica. Podrobnosti pred namestitvijo so na strani aplikacije.",
  },
] as const;

export default function FreeApkPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Section labelledBy="apk-title" className="bg-[#050816] light:bg-slate-50">
          <div className="mx-auto max-w-[64rem] pt-4 sm:pt-8">
            <p className={cn(kickerClass, "text-emerald-300 light:text-emerald-700")}>
              JU-TAN STUDIO · BREZPLAČNE ANDROID APLIKACIJE
            </p>
            <h1 id="apk-title" className="mt-6 font-heading text-4xl font-semibold leading-tight tracking-tight text-white light:text-slate-900 sm:text-5xl lg:text-6xl">
              FREE APK<br /><span className="text-emerald-400 light:text-emerald-700">ZA PODJETJA</span>
            </h1>
            <p className={cn(bodyClass, "mt-6 max-w-[42rem] light:text-slate-600")}>
              Manj papirjev na kupu. Več reda v telefonu. Izberi aplikacijo za račune ali potne naloge ter na njeni strani poišči navodila in prenos.
            </p>
            <p className="mt-6 flex items-center gap-3 text-sm text-slate-300 light:text-slate-700">
              <Smartphone className="h-5 w-5 shrink-0" aria-hidden="true" /> Za telefone Android · brezplačna uporaba
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {apps.map(({ title, href, icon: Icon, description, note }) => (
                <article key={href} className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-6 light:border-slate-200 light:bg-white sm:p-8">
                  <Icon className="mb-6 h-9 w-9 text-emerald-400 light:text-emerald-700" aria-hidden="true" />
                  <h2 className="font-heading text-2xl font-semibold text-white light:text-slate-900">{title}</h2>
                  <p className="mt-4 text-base leading-7 text-slate-300 light:text-slate-700">{description}</p>
                  <p className="mb-8 mt-4 text-sm leading-6 text-slate-400 light:text-slate-600">{note}</p>
                  <Link href={href} className="mt-auto inline-flex min-h-12 items-center justify-between gap-3 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500" aria-label={`Predstavitev in prenos: ${title}`}>
                    Predstavitev in prenos <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
            <section aria-labelledby="apk-guide-title" className="mt-12 max-w-[64rem] border-t border-white/10 pt-9 light:border-slate-200">
              <h2 id="apk-guide-title" className="font-heading text-2xl font-semibold text-white light:text-slate-900">
                Kako izbrati in namestiti aplikacijo?
              </h2>
              <ol className="mt-6 grid gap-5 md:grid-cols-3">
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200">
                  <h3 className="font-semibold text-emerald-400 light:text-emerald-700">1. Izberi opravilo</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 light:text-slate-700">
                    Za fotografiranje in urejanje prejetih računov odpri Prejeti računi. Če urejaš že podpisane potne naloge, izberi Pošlji potne naloge.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200">
                  <h3 className="font-semibold text-emerald-400 light:text-emerald-700">2. Preveri zahteve in različico</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 light:text-slate-700">
                    Na strani izbrane aplikacije preberi opis, opombe o različici in navodila. Namestitveno datoteko prenesi prek tam navedene povezave.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 p-5 light:border-slate-200">
                  <h3 className="font-semibold text-emerald-400 light:text-emerald-700">3. Namesti na Android</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 light:text-slate-700">
                    Odpri preneseno datoteko APK in sledi navodilom telefona. Če Android zahteva dovoljenje za namestitev iz tega vira, ga odobri le za zaupanja vredno datoteko in ga nato po potrebi znova izklopi.
                  </p>
                </li>
              </ol>
              <p className="mt-6 text-sm leading-7 text-slate-400 light:text-slate-600">
                APK je namestitvena datoteka za Android; aplikaciji nista namenjeni napravam iPhone. Če potrebuješ pojasnilo glede izbire ali namestitve, nam <Link href="/kontakt" className="font-semibold text-emerald-400 underline underline-offset-4 light:text-emerald-700">pošlji vprašanje</Link>.
              </p>
            </section>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

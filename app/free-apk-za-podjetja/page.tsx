import Link from "next/link";
import { ArrowUpRight, Files, Smartphone, FolderArchive } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Section from "@/components/common/Section";
import { bodyClass, kickerClass } from "@/design";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "FREE APK ZA PODJETJA – brezplačne Android aplikacije",
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
            <p className="mt-8 max-w-[48rem] text-sm leading-7 text-slate-400 light:text-slate-600">
              APK je namestitvena datoteka za Android. Pred prenosom preveri zahteve in opombe pri izbrani aplikaciji. Aplikaciji nista namenjeni napravam iPhone.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

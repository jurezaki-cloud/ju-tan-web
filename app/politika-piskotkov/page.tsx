import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FadeIn } from "@/components/animations";
import SectionTitle from "@/components/common/SectionTitle";
import { surfacePanel, insetSurface, textLinkClass } from "@/design";
import { cn } from "@/lib/utils";
import {
  createPageMetadata,
  breadcrumbJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import { privacyGdprEmail } from "@/lib/data/privacy";

export const metadata: Metadata = createPageMetadata({
  title: "Politika piškotkov",
  description:
    "Politika piškotkov in shrambe v brskalniku podjetja JU-TAN. Informacije o localStorage, piškotkih in analitiki.",
  path: "/politika-piskotkov",
});

const lastUpdated = "17. 9. 2026";

type StorageRow = {
  name: string;
  mechanism: string;
  purpose: string;
  duration: string;
  category: string;
};

const storageRows: StorageRow[] = [
  {
    name: "theme",
    mechanism: "localStorage",
    purpose:
      "Shrani izbrano svetlo ali temno temo (next-themes), da se ohrani med obiski.",
    duration:
      "Ostane v brskalniku, dokler ga ne izbrišete vi ali brskalnik (ni nastavljenega samodejnega poteka).",
    category: "Nujno / preferenca prikaza",
  },
  {
    name: "ju-tan-analytics",
    mechanism: "localStorage",
    purpose:
      "Shrani vašo odločitev o analitiki (»accepted« ali »necessary«), da se pasica ne prikaže znova in da se analitika vklopi le ob privolitvi.",
    duration:
      "Ostane v brskalniku, dokler ga ne izbrišete vi ali brskalnik (ni nastavljenega samodejnega poteka).",
    category: "Nujno za zapomnitev izbire (vrednost same privolitve je prostovoljna)",
  },
  {
    name: "jutan-ai-agent",
    mechanism: "localStorage",
    purpose:
      "Shrani zgodovino pogovora v vodiču JU-TAN agent (sporočila in stanje obrazca). Če oddate povpraševanje prek vodiča, lahko povzetek vključuje ime, e-pošto in druge vnesene podatke.",
    duration:
      "Ostane v brskalniku, dokler ga ne izbrišete vi, brskalnik ali funkcija brisanja zgodovine v vodiču (ni nastavljenega samodejnega poteka).",
    category: "Funkcionalno / preferenca vodiča",
  },
  {
    name: "jt_access",
    mechanism: "piškotek (HttpOnly)",
    purpose:
      "Sejni piškotek za prijavo v platformo JU-TAN (dostop do zaščitenih delov aplikacije). Na javnem brskanju trženjske strani se ne uporablja.",
    duration:
      "Do poteka seje: običajno do 8 ur; ob izbiri »zapomni si me« do 30 dni.",
    category: "Nujno za prijavo (le prijavljeni uporabniki)",
  },
  {
    name: "jt_refresh",
    mechanism: "piškotek (HttpOnly)",
    purpose:
      "Osvežitveni sejni piškotek za vzdrževanje prijave v platformo JU-TAN.",
    duration: "Do 14 dni.",
    category: "Nujno za prijavo (le prijavljeni uporabniki)",
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <article className="section-y">
          <div className="container">
            <FadeIn className="mx-auto max-w-[860px]">
              <SectionTitle
                heading="h1"
                badge="Pravna obvestila"
                title="Politika piškotkov"
                description="Ta stran pojasnjuje, kako spletno mesto JU-TAN uporablja piškotke in lokalno shrambo brskalnika, ter kdaj se aktivira merjenje obiska."
              />
              <p className="mt-4 text-[14px] text-slate-500">
                Zadnja posodobitev: {lastUpdated}
              </p>

              <div
                className={cn(
                  surfacePanel,
                  "mt-8 space-y-6 text-[16px] leading-[1.7] text-slate-400 light:text-slate-600",
                )}
              >
                <section className="space-y-3">
                  <h2 className="font-heading text-[20px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                    Piškotki in lokalna shramba
                  </h2>
                  <p>
                    Klasični piškotki so majhne datoteke, ki jih strežnik ali
                    skripta shrani v brskalnik. Lokalna shramba (localStorage) je
                    ločen mehanizem: podatki ostanejo na vaši napravi in se
                    samodejno ne pošiljajo z vsako zahtevo, kot to pogosto
                    počnejo piškotki.
                  </p>
                  <p>
                    Javno spletno mesto JU-TAN se v veliki meri opira na
                    localStorage (tema, privolitev v analitiko, zgodovina
                    vodiča). Tradicionalni piškotki se uporabljajo predvsem za
                    prijavo v platformo.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-heading text-[20px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                    Analitika in merjenje učinkovitosti
                  </h2>
                  <p>
                    Osnovno delovanje strani (prikaz vsebine, izbira teme,
                    kontaktni obrazec) ni pogojeno s privolitvijo v analitiko.
                  </p>
                  <p>
                    Ob prvem obisku se prikaže pasica z možnostjo »Sprejmem« ali
                    »Samo nujno«. Izbira se shrani v localStorage pod ključem{" "}
                    <code className="text-[14px] text-slate-300 light:text-slate-700">
                      ju-tan-analytics
                    </code>
                    .
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      ob izbiri »Sprejmem« se aktivirata Vercel Web Analytics in
                      Vercel Speed Insights;
                    </li>
                    <li>
                      ob izbiri »Samo nujno« se ti komponenti ne naložita;
                    </li>
                    <li>
                      dokler odločitve ne sprejmete, se analitika ne aktivira.
                    </li>
                  </ul>
                  <p>
                    Po javni dokumentaciji ponudnika Vercel Web Analytics in
                    Speed Insights ne temeljita na tradicionalnih piškotkih za
                    sledenje. V tej implementaciji ju nalagamo le po privolitvi;
                    ločenih piškotkov analitike v naši kodi ne nastavljamo.
                  </p>
                  <p>
                    Ločenega nastavitvenega zaslona za spremembo privolitve ni.
                    Če želite odločitev spremeniti, v nastavitvah brskalnika
                    izbrišite shranjene podatke tega spletnega mesta oziroma
                    ključ{" "}
                    <code className="text-[14px] text-slate-300 light:text-slate-700">
                      ju-tan-analytics
                    </code>
                    ; ob naslednjem obisku se pasica znova prikaže.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-heading text-[20px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                    Pregled shrambe
                  </h2>
                  <p>
                    Spodnji seznam temelji na preverjenem obnašanju trenutne
                    produkcijske kode.
                  </p>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[640px] border-collapse text-left text-[14px] leading-[1.55]">
                      <thead>
                        <tr className="border-b border-white/10 text-[12px] uppercase tracking-[0.08em] text-slate-500 light:border-slate-200">
                          <th className="py-3 pr-3 font-medium">Ime</th>
                          <th className="py-3 pr-3 font-medium">Mehanizem</th>
                          <th className="py-3 pr-3 font-medium">Namen</th>
                          <th className="py-3 pr-3 font-medium">Trajanje</th>
                          <th className="py-3 font-medium">Kategorija</th>
                        </tr>
                      </thead>
                      <tbody>
                        {storageRows.map((row) => (
                          <tr
                            key={row.name}
                            className="border-b border-white/8 align-top light:border-slate-200/80"
                          >
                            <td className="py-3 pr-3 font-medium text-white light:text-slate-900">
                              <code>{row.name}</code>
                            </td>
                            <td className="py-3 pr-3">{row.mechanism}</td>
                            <td className="py-3 pr-3">{row.purpose}</td>
                            <td className="py-3 pr-3">{row.duration}</td>
                            <td className="py-3">{row.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="space-y-3 md:hidden">
                    {storageRows.map((row) => (
                      <li key={row.name} className={insetSurface}>
                        <p className="font-heading text-[15px] font-semibold text-white light:text-slate-900">
                          <code>{row.name}</code>
                        </p>
                        <p className="mt-2 text-[13px] text-slate-500">
                          {row.mechanism} · {row.category}
                        </p>
                        <p className="mt-2 text-[14px] leading-[1.65]">
                          {row.purpose}
                        </p>
                        <p className="mt-2 text-[14px] leading-[1.65]">
                          <span className="text-slate-500">Trajanje: </span>
                          {row.duration}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="font-heading text-[20px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                    Upravljanje v brskalniku
                  </h2>
                  <p>
                    Piškotke in localStorage lahko kadar koli izbrišete ali
                    omejite v nastavitvah brskalnika. Brisanje ključa{" "}
                    <code className="text-[14px] text-slate-300 light:text-slate-700">
                      ju-tan-analytics
                    </code>{" "}
                    ponovno prikaže pasico za analitiko. Brisanje{" "}
                    <code className="text-[14px] text-slate-300 light:text-slate-700">
                      theme
                    </code>{" "}
                    ponastavi temo na privzeto. Brisanje{" "}
                    <code className="text-[14px] text-slate-300 light:text-slate-700">
                      jutan-ai-agent
                    </code>{" "}
                    zbriše lokalno zgodovino vodiča.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-heading text-[20px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                    Več o obdelavi osebnih podatkov
                  </h2>
                  <p>
                    Podrobnosti o upravljavcu, namenih, hrambi in vaših pravicah
                    so v{" "}
                    <Link href="/politika-zasebnosti" className={textLinkClass}>
                      Politiki zasebnosti
                    </Link>
                    . Vprašanja o varstvu podatkov lahko pošljete na{" "}
                    <a
                      href={`mailto:${privacyGdprEmail}`}
                      className={textLinkClass}
                    >
                      {privacyGdprEmail}
                    </a>
                    .
                  </p>
                </section>
              </div>
            </FadeIn>
          </div>
        </article>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            ...breadcrumbJsonLd(
              [
                { name: "Domov", path: "/" },
                { name: "Politika piškotkov", path: "/politika-piskotkov" },
              ],
              "breadcrumb-cookies",
            ),
          }),
        }}
      />
      <Footer />
    </>
  );
}

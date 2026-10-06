import Link from "next/link";
import Section from "@/components/common/Section";

const projects = [
  {
    title: "Veli Jože",
    type: "Neuradni portal pavšalistov",
    text: "Spletni portal za skupnost pavšalistov kampa Veli Jože v Savudriji. Projekt povezuje informacije o bivanju in okolici v pregledno spletno izkušnjo za telefon in računalnik. Gre za neuradni portal, ki ni uradna spletna stran upravljavca kampa.",
    href: "/reference/veli-joze",
    tags: ["Portal skupnosti", "UI/UX", "Spletni razvoj", "Responsive"],
    accent: "SKUPNOST · KAMP · SAVUDRIJA",
    metric: "veli-joze.eu",
  },
  {
    title: "Tanjina lučka upanja",
    type: "Spletna predstavitev pobude",
    text: "Spletna predstavitev pobude Tanje Hrup za podporo družinam in posameznikom v stiski. Pri oblikovanju smo izhajali iz topline, preglednega podajanja informacij in jasne poti do prvega stika. Projekt povezuje oblikovanje uporabniške izkušnje in spletni razvoj v predstavitev, ki obiskovalcu pomaga razumeti namen pobude ter poiskati kontakt.",
    href: "/reference/tanjina-lucka-upanja",
    tags: ["UI/UX", "Spletni razvoj", "Responsive"],
    accent: "ČLOVEČNOST · BLIŽINA · UPANJE",
    metric: "Pobuda Tanje Hrup",
  },
  {
    title: "KampRadar",
    type: "Spletni portal",
    text: "Spletni portal za iskanje kampov v Sloveniji in na Hrvaškem. Projekt združuje prikaz lokacij, iskanje, primerjavo kampov in shranjevanje priljubljenih izbir. Pri uporabniški izkušnji je poudarek na preglednem raziskovanju ponudbe in jasnem prikazu virov podatkov. KampRadar predstavlja primer spletne aplikacije, pri kateri oblikovanje podpira delo z večjo zbirko informacij.",
    href: "/reference/kampradar",
    tags: ["Portal", "UI/UX", "Iskanje", "Primerjava"],
    accent: "NAJDI SVOJ KAMP",
    metric: "Slovenija + Hrvaška",
  },
  {
    title: "JU-TAN Office",
    type: "Lasten programski izdelek",
    text: "Lasten slovenski poslovni program za Windows, ki povezuje račune, ponudbe, stranke, plačila, artikle in zalogo. JU-TAN Office razvijamo za pregledno vsakodnevno poslovanje: od priprave dokumentov do spremljanja plačil in poslovnih podatkov. Projekt vključuje načrtovanje namiznega vmesnika ter razvoj v Pythonu in PySide6. Podrobnosti in možnosti prenosa so na predstavitveni strani programa.",
    href: "/reference/ju-tan-office",
    tags: ["Windows", "Python", "PySide6", "Poslovanje"],
    accent: "POSLOVANJE NA ENEM MESTU",
    metric: "JU-TAN produkt",
  },
  {
    title: "JU-TAN Creative",
    type: "Predstavitev storitve",
    text: "Profesionalna izdelava logotipov, celostnih grafičnih podob, letakov, vizitk, predlog, promocijskih materialov in digitalnih dizajnov.",
    href: "/graficno-oblikovanje",
    tags: ["Logotipi", "CGP", "Tisk", "Digitalni dizajn"],
    accent: "IDEJA · IDENTITETA · UČINEK",
    metric: "Grafika od A do Ž",
  },
] as const;

export default function References({ full = false }: { full?: boolean }) {
  const titleClass = `${full ? "heading-hero" : "heading-display"} font-heading font-semibold`;
  return (
    <Section
      labelledBy="references-title"
      className="bg-[#050816] light:bg-slate-50"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
          REFERENCE JU-TAN
        </p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            {full ? (
              <h1 id="references-title" className={titleClass}>
                Projekti, ki govorijo za naše delo.
              </h1>
            ) : (
              <h2 id="references-title" className={titleClass}>
                Izbrani projekti
              </h2>
            )}
            <p className="mt-4 max-w-2xl text-slate-400 light:text-slate-600">
              Izbrani projekti JU-TAN Studio iz Cerknice: spletne predstavitve,
              portali in lastna poslovna programska oprema. Pri vsakem projektu
              povezujemo namen, uporabniško izkušnjo in razvoj. Ob projektih
              predstavljamo tudi ponudbo grafičnega oblikovanja za podjetja.
            </p>
          </div>
          {!full && (
            <Link
              href="/reference"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Vse reference →
            </Link>
          )}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {projects.map((project) => {
            const body = (
              <>
                <div className="relative mb-7 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-cyan-500/5 to-transparent p-5 light:border-slate-200">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
                  <p className="relative text-[10px] font-semibold tracking-[0.22em] text-emerald-400">
                    {project.accent}
                  </p>
                  <p className="relative mt-8 font-heading text-xl font-semibold">
                    {project.title}
                  </p>
                  <p className="relative mt-1 text-xs text-slate-400 light:text-slate-600">
                    {project.metric}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-emerald-400">
                    {project.type}
                  </span>
                  <span
                    className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden
                  >
                    ↗
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-2xl font-semibold">
                  {project.title}
                </h3>
                <p className="mt-3 min-h-24 text-sm leading-6 text-slate-400 light:text-slate-600">
                  {project.text}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 light:border-slate-200 light:text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            );
            const cls =
              "group block rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_70px_rgba(22,163,74,.12)] light:border-slate-200 light:bg-white";
            return project.href.startsWith("http") ? (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {body}
              </a>
            ) : (
              <Link key={project.title} href={project.href} className={cls}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

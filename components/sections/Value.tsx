import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { bodyClass, kickerClass } from "@/design";

const processSteps = [
  "Povpraševanje",
  "Ponudba",
  "Odobritev",
  "Izvedba",
  "Zaključek",
] as const;

const systemLabels = ["CRM", "ERP", "Portal", "Dokumenti"] as const;

const outcomes = [
  {
    index: "01",
    label: "Podatki",
    title: "En vnos, več naslednjih korakov",
    text: "Povpraševanje, ponudba, naročilo ali zahtevek ne krožijo več kot več različic iste informacije. Podatek se vnese enkrat in ostane uporaben naprej.",
  },
  {
    index: "02",
    label: "Pregled",
    title: "Status je viden tam, kjer ga ekipa potrebuje",
    text: "Informacije niso razpršene med pošto, preglednicami in klici. Vsak vidi, v kateri fazi je primer in kaj ga čaka naprej.",
  },
  {
    index: "03",
    label: "Odobritve",
    title: "Odločanje dobi jasno pot",
    text: "Namesto ročnih posredovanj in lovljenja odgovorov sistem usmeri zahtevek do prave osebe, z zgodovino odločitev na enem mestu.",
  },
  {
    index: "04",
    label: "Sodelovanje",
    title: "Manj usklajevanja, več izvedbe",
    text: "Ko prodaja, operativa in administracija delajo na istem toku, manj časa porabijo za preverjanje in več za dejansko obdelavo.",
  },
] as const;

export default function Value() {
  return (
    <Section id="podrocja-sodelovanja" belowFold>
      <SectionTitle
        badge="Operativni tok"
        title="Največ stroška ne ustvarja delo samo, temveč prehodi med sistemi."
        description="Ko isti podatek potuje med preglednico, e-pošto, ERP-jem, CRM-jem in internimi postopki, se izgublja čas, kontekst in odgovornost. Ko so povezave postavljene pravilno, podjetje ne dobi le novega orodja, ampak enoten tok dela, v katerem je jasno, kdo nadaljuje, kaj je potrjeno in kaj čaka na naslednji korak."
        className="max-w-3xl"
        descriptionClassName="max-w-[48rem] light:text-slate-600"
      />

      <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-7 lg:p-8 light:border-slate-200/80 light:bg-white/70">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 light:border-slate-200">
            <div>
              <p className={kickerClass}>Operativna os</p>
              <p className="mt-2 max-w-[24rem] text-[14px] leading-[1.7] text-slate-400 light:text-slate-600">
                Enoten poslovni tok poveže naslednje korake in zmanjša ročne prenose med sistemi.
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                Povpraševanje → Ponudba → Odobritev → Izvedba → Zaključek
              </p>
            </div>
            <div className="hidden text-right text-[11px] uppercase tracking-[0.18em] text-slate-500 sm:block light:text-slate-500">
              Sistemski kontekst
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="relative">
              <div
                className="absolute left-4 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,rgba(22,163,74,0.28),rgba(255,255,255,0.08))] lg:left-0 lg:right-0 lg:top-4 lg:bottom-auto lg:h-px lg:w-auto lg:bg-[linear-gradient(to_right,rgba(22,163,74,0.28),rgba(255,255,255,0.08))] light:bg-[linear-gradient(to_bottom,rgba(21,128,61,0.22),rgba(148,163,184,0.2))] lg:light:bg-[linear-gradient(to_right,rgba(21,128,61,0.22),rgba(148,163,184,0.2))]"
                aria-hidden
              />
              <ol className="relative grid gap-4 lg:grid-cols-5 lg:gap-0">
              {processSteps.map((step, index) => (
                <li key={step} className="relative min-w-0 pl-12 lg:px-3 lg:pl-0 lg:pt-9">
                  <span
                    className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#16a34a]/35 bg-[#16a34a]/8 text-[11px] font-semibold text-[#4ade80] lg:left-1/2 lg:-translate-x-1/2 light:text-[#15803d]"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                    Korak
                  </p>
                  <p className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                    {step}
                  </p>
                </li>
              ))}
              </ol>
            </div>

            <div className="border-t border-white/10 pt-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0 light:border-slate-200">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                Sistemi v ozadju
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:max-w-[15rem] lg:grid-cols-1">
                {systemLabels.map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-white/10 px-3 py-2 text-[12px] tracking-[0.04em] text-slate-300 light:border-slate-200 light:text-slate-700"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="min-w-0 border-t border-white/10 light:border-slate-200">
          <ul>
            {outcomes.map((item) => (
              <li
                key={item.index}
                className="grid gap-3 border-b border-white/10 py-5 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-5 light:border-slate-200"
              >
                <div className="flex items-center gap-3 sm:block">
                  <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#16a34a] light:text-[#15803d]">
                    {item.index}
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.14em] text-slate-500 light:text-slate-500">
                    {item.label}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[22px] font-semibold tracking-[-0.035em] text-white light:text-slate-900">
                    {item.title}
                  </h3>
                  <p className={`${bodyClass} mt-2 text-[15px] md:text-[16px] light:text-slate-600`}>
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import { bodyClass, kickerClass } from "@/design";

const scenarios = [
  {
    number: "01",
    title: "Od povpraševanja do izvedbe",
    situation:
      "Povpraševanje pride prek obrazca, e-pošte ali telefona, nato pa se isti podatki prepisujejo v ponudbo, interno evidenco in izvedbo.",
    connection:
      "Zajem povpraševanja, CRM zapis, pripravo ponudbe, odobritve ter prenos v delovni nalog ali operativni modul.",
    outcome:
      "Ekipa dela na enem primeru z vidnim statusom, brez ponovnega vnosa istih podatkov.",
    labels: "CRM · Ponudbe · Odobritve · Operativa",
  },
  {
    number: "02",
    title: "Servisni zahtevek brez lovljenja statusa",
    situation:
      "Zahteve prihajajo po e-pošti in telefonu, priloge so razpršene, prioritete pa se določajo sproti.",
    connection:
      "Vstopno točko za zahtevek, dodelitev odgovorni osebi, status obdelave ter povezavo na interne evidence in dokumente.",
    outcome:
      "Zahtevki pridejo v urejen tok, status je viden, predaja med ekipami pa ni več odvisna od ročnega usklajevanja.",
    labels: "Portal · Servis · Dokumenti · Statusi",
  },
  {
    number: "03",
    title: "Dokumenti in odobritve med oddelki",
    situation:
      "Ponudbe, naročila, pogodbe ali interni zahtevki krožijo v več verzijah, zato ni jasno, kdo mora odločiti naslednji.",
    connection:
      "Obrazce, dokumentne tokove, vloge, odobritvena pravila in sled odločitev na enem mestu.",
    outcome:
      "Vsak korak dobi odgovorno osebo in zgodovino, zato je manj čakanja in manj iskanja zadnje verzije.",
    labels: "Dokumenti · Odobritve · Vloge · Evidence",
  },
  {
    number: "04",
    title: "AI podpora pri ponavljajočih se opravilih",
    situation:
      "Ekipa ročno prebira sporočila, razvršča zahtevke in pripravlja osnutke odgovorov ali povzetkov iz več virov.",
    connection:
      "Pravila za zajem podatkov, iskanje po znanju, pripravo osnutkov ter predajo človeku tam, kjer je potrebna potrditev.",
    outcome:
      "Ljudje ne začenjajo iz praznega zaslona, ampak iz pripravljenega konteksta, odločitev pa ostane pod nadzorom ekipe.",
    labels: "AI podpora · Klasifikacija · Znanje · Nadzor",
  },
] as const;

export default function Projects() {
  return (
    <Section
      id="projects"
      belowFold
      labelledBy="projects-heading"
      innerClassName="overflow-x-hidden"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
        <FadeIn>
          <div id="projects-heading">
            <SectionTitle
              className="mb-0 max-w-[56rem]"
              index="04"
              badge="Primeri sistemov"
              title="Kako je povezan sistem videti v praksi"
              description="Tipični scenariji pokažejo, kje se podatki, odobritve in izvedba najpogosteje prekinjajo ter kaj se spremeni, ko je tok povezan."
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="max-w-[52rem] border-l border-[#16a34a]/40 pl-4 text-[14px] leading-[1.7] text-slate-400 light:text-slate-600">
            Spodnji primeri prikazujejo tipične scenarije uporabe, ne javne reference naročnikov.
          </p>
        </FadeIn>

        <div className="border-y border-white/8 light:border-slate-200/80">
          {scenarios.map((scenario, index) => (
            <FadeIn key={scenario.number} delay={0.06 + index * 0.05}>
              <article
                className={`grid gap-8 py-8 md:py-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10 ${
                  index > 0
                    ? "border-t border-white/8 light:border-slate-200/80"
                    : ""
                }`}
              >
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="space-y-3">
                    <p className="font-heading text-[2rem] font-semibold tracking-[-0.05em] text-[#16a34a]">
                      {scenario.number}
                    </p>
                    <h3 className="font-heading text-[1.5rem] font-semibold tracking-[-0.035em] text-white light:text-slate-900">
                      {scenario.title}
                    </h3>
                  </div>
                  <p className="text-[12px] uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                    {scenario.labels}
                  </p>
                </div>

                <div className="grid gap-0 divide-y divide-white/8 border-white/8 md:grid-cols-3 md:divide-x md:divide-y-0 light:divide-slate-200/80 light:border-slate-200/80">
                  <div className="pb-5 md:px-5 md:pb-0 md:first:pl-0 md:last:pr-0">
                    <p className={kickerClass}>Situacija</p>
                    <p className={`${bodyClass} mt-3 light:text-slate-600`}>
                      {scenario.situation}
                    </p>
                  </div>
                  <div className="py-5 md:px-5 md:py-0 md:first:pl-0 md:last:pr-0">
                    <p className={kickerClass}>Kaj povežemo</p>
                    <p className={`${bodyClass} mt-3 light:text-slate-600`}>
                      {scenario.connection}
                    </p>
                  </div>
                  <div className="pt-5 md:px-5 md:pt-0 md:first:pl-0 md:last:pr-0">
                    <p className={kickerClass}>Kaj se spremeni</p>
                    <p className={`${bodyClass} mt-3 light:text-slate-600`}>
                      {scenario.outcome}
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}

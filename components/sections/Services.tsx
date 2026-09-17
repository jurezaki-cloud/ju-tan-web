import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";

const solutionGroups = [
  {
    index: "01",
    title: "Prodaja, operativa in enotni podatki",
    problem:
      "Stranke, primeri in dokumenti živijo v več evidencah, zato ekipa dela z različnimi verzijami iste informacije.",
    build:
      "CRM po meri, operativne module, evidence, dokumentne tokove in odobritve na skupnem podatkovnem jedru.",
    outcome:
      "Prodaja, izvedba in administracija delajo na istem zapisu, zato je pot od prvega kontakta do izvedbe bolj pregledna in manj odvisna od ročnega usklajevanja.",
    labels: ["CRM", "ERP moduli", "Dokumenti", "Odobritve"],
  },
  {
    index: "02",
    title: "Integracije in avtomatizacija",
    problem:
      "ERP, računovodstvo, spletni obrazci, e-pošta in interna orodja so povezana le ročno ali sploh ne.",
    build:
      "API povezave, sinhronizacije, avtomatizirane tokove, obvestila in poslovna pravila, da podatki prehajajo brez prepisovanja.",
    outcome:
      "Obstoječa orodja začnejo delovati kot en proces, ne kot ločeni otoki.",
    labels: ["API", "ERP", "Računovodstvo", "Avtomatizacija"],
  },
  {
    index: "03",
    title: "Portali in poslovne aplikacije",
    problem:
      "Stranke, partnerji ali interna ekipa nimajo enotnega mesta za oddajo zahtevkov, vpogled v status ali vsakodnevno delo.",
    build:
      "Portale in poslovne aplikacije z vlogami, obrazci, statusi, dokumenti in povezavo na notranje sisteme.",
    outcome:
      "Uporabnik dobi jasno vstopno točko, podjetje pa urejen tok obdelave za zahtevke, komunikacijo in dokumente.",
    labels: ["Portali", "Vloge", "Obrazci", "Statusi"],
  },
  {
    index: "04",
    title: "AI podprti delovni tokovi",
    problem:
      "Rutinska priprava odgovorov, osnutkov, povzetkov in razvrščanje zahtevkov jemljejo čas ljudem, ki bi morali odločati.",
    build:
      "AI podporo tam, kjer že nastajajo podatki: pri iskanju informacij, pripravi osnutkov, razvrščanju zahtevkov in pripravi naslednjih korakov.",
    outcome:
      "AI pomaga pri pripravljalnih opravilih znotraj nadzorovanega procesa, ekipa pa potrjuje, dopolnjuje in vodi izjeme.",
    labels: ["AI agenti", "Iskanje po znanju", "Osnutki", "Nadzor"],
  },
] as const;

export default function Services() {
  return (
    <Section id="services" belowFold>
      <FadeIn>
        <SectionTitle
          badge="Rešitve"
          title="Kje JU-TAN vzpostavi povezan poslovni sistem"
          description="Rešitve povezujemo okoli dejanskih poslovnih procesov — od skupnih podatkov in operativnih tokov do integracij, portalov in premišljene uporabe AI."
          className="max-w-3xl"
          descriptionClassName="max-w-[48rem] light:text-slate-600"
        />
      </FadeIn>

      <div className="mx-auto w-full max-w-[1200px] border-t border-white/10 light:border-slate-200">
        <ol>
          {solutionGroups.map((group) => (
            <li
              key={group.index}
              className="grid gap-6 border-b border-white/10 py-8 lg:grid-cols-[4.5rem_minmax(0,18rem)_minmax(0,1fr)] lg:gap-8 lg:py-10 light:border-slate-200"
            >
              <div className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#16a34a] light:text-[#15803d]">
                {group.index}
              </div>

              <div className="min-w-0">
                <h3 className="text-[28px] font-semibold tracking-[-0.04em] text-white light:text-slate-900">
                  {group.title}
                </h3>
              </div>

              <div className="min-w-0">
                <div className="grid gap-5 md:grid-cols-3 md:gap-6">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                      Problem
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.75] text-slate-300 light:text-slate-700">
                      {group.problem}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                      Kaj vzpostavimo
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.75] text-slate-300 light:text-slate-700">
                      {group.build}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                      Učinek
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.75] text-slate-300 light:text-slate-700">
                      {group.outcome}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {group.labels.map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-white/10 px-3 py-2 text-[12px] tracking-[0.04em] text-slate-400 light:border-slate-200 light:text-slate-600"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

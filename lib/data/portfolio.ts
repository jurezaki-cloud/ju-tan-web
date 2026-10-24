export type PortfolioKind = "website" | "software" | "service";

export type PortfolioProject = {
  title: string;
  kind: PortfolioKind;
  type: string;
  accent: string;
  context: string;
  summary: string;
  objective: string;
  solution: string;
  functionality: readonly string[];
  technologies: readonly string[];
  benefits: string;
  href: string;
  linkLabel: string;
};

/**
 * Public JU-TAN work already documented in this repository.
 * Clients, metrics, awards, and screenshots are omitted when they are not in source.
 */
export const portfolioProjects: readonly PortfolioProject[] = [
  {
    title: "Tanjina lučka upanja",
    kind: "website",
    type: "Spletna predstavitev pobude",
    accent: "ČLOVEČNOST · BLIŽINA · UPANJE",
    context: "Pobuda Tanje Hrup",
    summary:
      "Digitalna predstavitev pobude Tanje Hrup za podporo družinam in posameznikom v stiski, zasnovana okoli človečnosti, bližine in jasnega prvega stika.",
    objective:
      "Predstaviti pobudo in omogočiti obiskovalcu, da hitro razume namen ter ve, kako stopiti v stik.",
    solution:
      "Spletna predstavitev z jasno vsebino, bližnjim tonom in odzivno postavitvijo.",
    functionality: [
      "Predstavitev pobude",
      "Jasen prvi stik",
      "Odzivna postavitev za telefon in računalnik",
    ],
    technologies: ["UI/UX", "Spletni razvoj", "Odzivna postavitev"],
    benefits:
      "Obiskovalec brez ovinkov razume, komu je pobuda namenjena in kako se oglasi.",
    href: "https://tanjinaluckaupanja.si",
    linkLabel: "Odpri spletno stran",
  },
  {
    title: "KampRadar",
    kind: "website",
    type: "Spletni portal",
    accent: "NAJDI SVOJ KAMP",
    context: "Slovenija in Hrvaška",
    summary:
      "Portal za iskanje kampov v Sloveniji in na Hrvaškem z jasnimi viri podatkov, primerjavo lokacij in možnostjo shranjevanja priljubljenih kampov.",
    objective:
      "Uporabniku omogočiti iskanje in primerjavo kampov na enem mestu.",
    solution:
      "Spletni portal z viri podatkov, primerjavo lokacij in shranjevanjem priljubljenih kampov.",
    functionality: [
      "Iskanje kampov",
      "Primerjava lokacij",
      "Shranjevanje priljubljenih kampov",
    ],
    technologies: ["Portal", "UI/UX", "Iskanje", "Primerjava"],
    benefits:
      "Iskanje, primerjava in seznam priljubljenih kampov so v istem toku.",
    href: "https://kampradar.si",
    linkLabel: "Odpri portal",
  },
  {
    title: "JU-TAN Office",
    kind: "software",
    type: "Lasten poslovni program",
    accent: "POSLOVANJE NA ENEM MESTU",
    context: "Lasten izdelek · v aktivnem razvoju",
    summary:
      "Slovenski poslovni program za Windows za račune, ponudbe, stranke, plačila, artikle, zalogo in pregled poslovanja.",
    objective:
      "s.p. in malim podjetjem združiti dokumente, stranke, plačila in zalogo v enem okolju.",
    solution:
      "Namizna aplikacija za Windows, ki račune, ponudbe, stranke, plačila, artikle in skladišče vodi v enem poslovnem toku.",
    functionality: [
      "Računi, ponudbe in predračuni",
      "Evidenca plačil in pošiljanje dokumentov",
      "Stranke in poslovni pregled",
      "Artikli, nabava in zaloga",
      "PDF dokumenti ter Excel uvoz in izvoz",
    ],
    technologies: ["Windows", "Python", "PySide6", "PDF", "Excel"],
    benefits:
      "Računi, plačila in zaloga so pregledni na enem mestu, brez ločenih preglednic za vsak korak.",
    href: "/ju-tan-office",
    linkLabel: "Oglejte si JU-TAN Office",
  },
  {
    title: "JU-TAN Creative",
    kind: "service",
    type: "Grafično oblikovanje",
    accent: "IDEJA · IDENTITETA · UČINEK",
    context: "Storitev studia",
    summary:
      "Profesionalna izdelava logotipov, celostnih grafičnih podob, letakov, vizitk, predlog, promocijskih materialov in digitalnih dizajnov.",
    objective:
      "Podjetju dati prepoznaven znak in usklajene materiale za splet ter tisk.",
    solution:
      "Logotip, celostna grafična podoba in promocijski materiali, pripravljeni za digitalno uporabo in tisk.",
    functionality: [
      "Izdelava logotipa",
      "Celostna grafična podoba",
      "Letaki, vizitke in predloge",
      "Digitalni dizajn",
    ],
    technologies: ["Logotip", "Celostna podoba", "Tisk", "Digitalni dizajn"],
    benefits:
      "Znamka nastopa usklajeno na spletu, dokumentih in promocijskih materialih.",
    href: "/graficno-oblikovanje",
    linkLabel: "Več o grafičnem oblikovanju",
  },
];

/** Contact / lead form service choices. Visible label === submitted value. */
export const contactServiceOptions = [
  "Spletne strani / UI-UX",
  "Grafično oblikovanje / logotip / celostna podoba",
  "E-trgovina ali digitalna platforma",
  "Spletna ali mobilna aplikacija",
  "Programska oprema po meri / SaaS",
  "CRM",
  "ERP",
  "Integracije in avtomatizacija",
  "AI (agenti / avtomatizacija dela)",
  "Svetovanje ali dolgoročna podpora",
  "JU-TAN Office",
  "Videoprodukcija",
  "Nisem prepričan / Drugo",
] as const;

/** Canonical public OfferCatalog L1 groups (locked homepage taxonomy). */
export const offerCatalog = [
  {
    name: "Splet in digitalne izkušnje",
    description:
      "Spletne strani, spletne trgovine in uporabniški vmesniki, kjer sta oblikovanje in tehnologija del iste rešitve.",
  },
  {
    name: "Programska oprema in aplikacije",
    description:
      "Spletne in mobilne aplikacije ter programska oprema po meri za procese, ki jih standardna orodja ne rešijo dovolj dobro.",
  },
  {
    name: "Grafično oblikovanje in identiteta",
    description:
      "Logotipi, celostne grafične podobe, letaki, vizitke in digitalni materiali za prepoznaven nastop podjetja.",
  },
  {
    name: "Videoprodukcija",
    description:
      "Promocijski videi, kratke vsebine za družbena omrežja, video oglasi in predstavitve izdelkov ali podjetja, tudi s podporo AI produkcije.",
  },
  {
    name: "Poslovni sistemi in AI",
    description:
      "Povežemo podatke, procese in obstoječe sisteme ter avtomatiziramo delo tam, kjer tehnologija prinese dejansko korist.",
  },
  {
    name: "Svetovanje in dolgoročna podpora",
    description:
      "Od tehnične usmeritve do vzdrževanja, nadgradenj in nadaljnjega razvoja po uvedbi.",
  },
] as const;

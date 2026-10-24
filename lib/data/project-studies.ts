export type ProjectStudy = {
  slug: string;
  name: string;
  title: string;
  description: string;
  kind: string;
  challenge: string;
  solution: string;
  work: string;
  outcome: string;
  href: string;
  service: string;
  serviceName: string;
  screenshot: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
  audience?: string;
  capabilities?: readonly { title: string; description: string }[];
};

export const projectStudies = [
  {
    slug: "veli-joze",
    screenshot: {
      src: "/reference/veli-joze.webp",
      alt: "Začetna stran neuradnega portala pavšalistov Veli Jože",
      width: 1348,
      height: 926,
      caption: "Portal Veli Jože z obvestili, dogodki in hitrimi povezavami.",
    },
    audience:
      "Pavšalisti in obiskovalci kampa Veli Jože, ki želijo informacije o bivanju, dogajanju in okolici Savudrije najti na enem mestu.",
    capabilities: [
      {
        title: "Informacije za bivanje",
        description:
          "Obvestila, dogodki in zemljevid kampa povezujejo vsakodnevne informacije v pregledne vsebinske sklope.",
      },
      {
        title: "Skupnost in sodelovanje",
        description:
          "Klepet skupnosti, mali oglasi in prijava težav ponujajo poti za izmenjavo informacij med člani.",
      },
      {
        title: "Raziskovanje Savudrije",
        description:
          "Galerija in predlogi za okolico dopolnjujejo informacije o kampu ter pomagajo pri načrtovanju prostega časa.",
      },
    ],
    name: "Veli Jože",
    title: "Veli Jože – razvoj neuradnega portala pavšalistov",
    description:
      "Spletni projekt JU-TAN za skupnost pavšalistov kampa Veli Jože v Savudriji. Neuradni portal, ki povezuje informacije o bivanju in okolici.",
    kind: "Portal skupnosti",
    challenge:
      "Pavšalisti in obiskovalci potrebujejo pregledno mesto za informacije o življenju v kampu in raziskovanju okolice Savudrije. Cilj projekta je vsebine povezati v uporabno spletno predstavitev skupnosti.",
    solution:
      "Vmesnik združuje obvestila, dogodke, zemljevid kampa, galerijo, male oglase in predloge za raziskovanje okolice. Vključuje tudi vstop v klepet skupnosti, prijavo težav ter pomočnika JOŠKO AI. Jasna navigacija povezuje te vsebinske sklope.",
    work: "Načrtovanje vsebinske strukture, oblikovanje uporabniške izkušnje in razvoj spletnega portala z odzivno postavitvijo za telefon in računalnik.",
    outcome:
      "Objavljen spletni portal za skupnost pavšalistov. Gre za neuradni projekt, ki ni uradna spletna stran upravljavca kampa. Aktualne vsebine in funkcionalnosti so predstavljene na veli-joze.eu.",
    href: "https://www.veli-joze.eu/",
    service: "/spletne-strani-in-ui-ux",
    serviceName: "Izdelava spletnih portalov",
  },
  {
    slug: "kampradar",
    screenshot: {
      src: "/reference/kampradar.webp",
      alt: "Začetna stran portala KampRadar z iskalnikom kampov",
      width: 1348,
      height: 926,
      caption: "KampRadar: iskanje kampov v Sloveniji in na Hrvaškem.",
    },
    audience:
      "Popotniki, družine in ljubitelji kampiranja, ki raziskujejo kampe v Sloveniji in na Hrvaškem ter želijo primerjati več možnosti pred odločitvijo.",
    capabilities: [
      {
        title: "Iskanje in lokacije",
        description:
          "Iskanje kampov in prikaz lokacij pomagata povezati ponudbo z območjem, ki ga uporabnik raziskuje.",
      },
      {
        title: "Primerjava kampov",
        description:
          "Primerjava več izbir v istem okolju omogoča pregled razlik brez nenehnega prehajanja med posameznimi predstavitvami.",
      },
      {
        title: "Priljubljene izbire",
        description:
          "Shranjevanje priljubljenih kampov omogoča, da se uporabnik vrne k izbranemu ožjemu naboru.",
      },
      {
        title: "Preglednost podatkov",
        description:
          "Jasno označevanje virov pomaga razumeti, od kod prihajajo informacije o posameznem kampu.",
      },
    ],
    name: "KampRadar",
    title: "KampRadar – razvoj portala za iskanje kampov",
    description:
      "Kako JU-TAN povezuje uporabniško izkušnjo, iskanje, primerjavo in prikaz lokacij v spletnem portalu KampRadar.",
    kind: "Spletni portal",
    challenge:
      "Pri izbiri kampa uporabnik primerja več lokacij in podatkov. Cilj projekta je te informacije povezati v pregledno raziskovanje kampov v Sloveniji in na Hrvaškem.",
    solution:
      "Portal povezuje iskanje, prikaz lokacij, primerjavo kampov in shranjevanje priljubljenih izbir. Struktura uporabniku pomaga prehajati od pregleda ponudbe do posameznega kampa.",
    work: "Načrtovanje uporabniške izkušnje, oblikovanje vmesnikov in spletni razvoj. Pri prikazu podatkov je poudarek na preglednosti informacij in jasnem označevanju virov.",
    outcome:
      "Projekt predstavlja spletno aplikacijo za delo z večjo zbirko lokacij in informacij. Iskanje in primerjava sta združena v enem okolju; trenutni obseg ponudbe si lahko ogledate na portalu.",
    href: "https://kampradar.si",
    service: "/spletne-strani-in-ui-ux",
    serviceName: "Izdelava spletnih strani in portalov",
  },
  {
    slug: "tanjina-lucka-upanja",
    screenshot: {
      src: "/reference/tanjina-lucka-upanja.webp",
      alt: "Začetna stran pobude Tanjina lučka upanja",
      width: 1348,
      height: 926,
      caption: "Spletna predstavitev pobude Tanjina lučka upanja.",
    },
    audience:
      "Družine in posamezniki v stiski ter obiskovalci, ki želijo spoznati pobudo Tanje Hrup in poiskati kontakt za prvi pogovor.",
    capabilities: [
      {
        title: "Razumljiv namen pobude",
        description:
          "Vsebinska struktura obiskovalcu predstavi namen pobude in mu pomaga razumeti, komu je namenjena.",
      },
      {
        title: "Jasna pot do stika",
        description:
          "Navigacija povezuje predstavitev pobude s kontaktnimi informacijami, da je naslednji korak preprost.",
      },
      {
        title: "Topla vizualna podoba",
        description:
          "Prijazen vizualni jezik in pregledna hierarhija vsebin podpirata mirno, razumljivo spletno predstavitev.",
      },
    ],
    name: "Tanjina lučka upanja",
    title: "Tanjina lučka upanja – oblikovanje in razvoj spletne strani",
    description:
      "Predstavitev spletnega projekta JU-TAN za pobudo Tanje Hrup: topla vizualna podoba, pregledna vsebina in pot do prvega stika.",
    kind: "Spletna predstavitev pobude",
    challenge:
      "Pobuda Tanje Hrup podpira družine in posameznike v stiski. Spletna predstavitev mora obiskovalcu jasno pojasniti njen namen ter omogočiti enostavno iskanje kontaktnih informacij.",
    solution:
      "Pri oblikovanju smo izhajali iz topline, prijaznega sprejema in preglednega podajanja informacij. Vsebina in navigacija obiskovalcu pomagata razumeti pobudo ter najti pot do prvega stika.",
    work: "Oblikovanje uporabniške izkušnje, vizualna zasnova in spletni razvoj z odzivno postavitvijo za telefone in večje zaslone.",
    outcome:
      "Spletna predstavitev povezuje namen pobude, njeno podobo in kontakt. Rezultat projekta si lahko ogledate na objavljeni strani.",
    href: "https://tanjinaluckaupanja.si",
    service: "/spletne-strani-in-ui-ux",
    serviceName: "Oblikovanje in izdelava spletnih strani",
  },
  {
    slug: "ju-tan-office",
    screenshot: {
      src: "/products/office/office-dashboard.webp",
      alt: "Nadzorna plošča poslovnega programa JU-TAN Office",
      width: 1896,
      height: 1001,
      caption: "Pregled poslovanja v programu JU-TAN Office.",
    },
    name: "JU-TAN Office",
    title: "JU-TAN Office – razvoj slovenskega poslovnega programa",
    description:
      "Lasten razvoj JU-TAN: namizni poslovni program za Windows, račune, ponudbe, plačila in zalogo, izdelan v Pythonu in PySide6.",
    kind: "Lasten programski izdelek",
    challenge:
      "Samostojni podjetniki in mala podjetja pri vsakodnevnem delu povezujejo dokumente, stranke, plačila in zalogo. Cilj lastnega izdelka je te naloge združiti v pregledno namizno okolje.",
    solution:
      "JU-TAN Office povezuje račune, ponudbe, stranke, plačila, artikle in zalogo. Poslovni podatki in priprava dokumentov so del istega programa za Windows.",
    work: "Načrtovanje namiznega uporabniškega vmesnika ter razvoj v Pythonu in PySide6. Projekt vključuje tudi pripravo poslovnih dokumentov in nadaljnje nadgradnje programa.",
    outcome:
      "Rezultat je lasten slovenski programski izdelek. Aktualne funkcionalnosti in možnosti prenosa predstavljamo na produktni strani JU-TAN Office.",
    href: "/ju-tan-office",
    service: "/razvoj-programske-opreme",
    serviceName: "Razvoj programske opreme po meri",
  },
] as const satisfies readonly ProjectStudy[];

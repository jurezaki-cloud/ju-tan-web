import { siteConfig } from "@/lib/config";

export const privacyLastUpdated = "17. 9. 2026";

export const privacyGdprEmail = "zasebnost-gdpr@ju-tan.com";

export const privacyMeta = {
  title: "Politika zasebnosti",
  description:
    "Politika zasebnosti podjetja JU-TAN. Informacije o obdelavi osebnih podatkov, pravicah posameznikov in skladnosti z GDPR.",
  path: "/politika-zasebnosti",
} as const;

export const privacyHero = {
  kicker: "Pravna obvestila",
  title: "Politika zasebnosti",
  description:
    "Varstvo osebnih podatkov jemljemo resno. Na tej strani pojasnjujemo, katere podatke zbiramo, zakaj jih obdelujemo ter kakšne pravice imate.",
} as const;

export const controllerFields = [
  { label: "Blagovna znamka", value: "JU-TAN", pending: false },
  {
    label: "Upravljavec",
    value: "JU-TAN studio, Tanja Hrup s.p.",
    pending: false,
  },
  {
    label: "Naslov",
    value: "Turšičeva ulica 07, 1380 Cerknica, Slovenija",
    pending: false,
  },
  { label: "Matična številka", value: "7575556000", pending: false },
  { label: "Davčna številka", value: "17113130", pending: false },
  { label: "Status za DDV", value: "Ni zavezanec za DDV.", pending: false },
  {
    label: "E-pošta za varstvo podatkov",
    value: privacyGdprEmail,
    pending: false,
  },
  { label: "Splošna e-pošta", value: "info@ju-tan.com", pending: false },
  { label: "Spletna stran", value: siteConfig.url, pending: false },
] as const;

export type PrivacyBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
  | { type: "rights"; items: { title: string; text: string }[] };

export type PrivacyChapter = {
  id: string;
  number: string;
  title: string;
  blocks: PrivacyBlock[];
};

export const privacyChapters: PrivacyChapter[] = [
  {
    id: "upravljavec",
    number: "01",
    title: "Upravljavec osebnih podatkov",
    blocks: [
      {
        type: "p",
        text: "Upravljavec osebnih podatkov je oseba, ki določa namene in sredstva obdelave. Za osebne podatke, ki jih obdelamo prek spletnega mesta JU-TAN, kontaktnega obrazca in povezanih komunikacij, je upravljavec JU-TAN studio, Tanja Hrup s.p.",
      },
      {
        type: "p",
        text: "Pooblaščenec za varstvo podatkov (DPO) ni imenovan. Vprašanja in zahteve v zvezi z varstvom osebnih podatkov naslovite na spodnji e-poštni naslov za varstvo podatkov.",
      },
      {
        type: "note",
        text: `Kontakt za varstvo osebnih podatkov: ${privacyGdprEmail}.`,
      },
    ],
  },
  {
    id: "podatki",
    number: "02",
    title: "Katere podatke zbiramo",
    blocks: [
      {
        type: "p",
        text: "Zbiramo le podatke, ki so potrebni za odgovor na vaše povpraševanje, morebitno sodelovanje ali tehnično delovanje spletnega mesta. Obseg je odvisen od tega, kaj nam sami posredujete, in od tehničnih zapisov, ki nastanejo ob obisku.",
      },
      {
        type: "p",
        text: "Prek kontaktnega obrazca (vključno z obrazcem v vodiču JU-TAN agent) lahko prejmemo:",
      },
      {
        type: "list",
        items: [
          "ime in priimek",
          "podjetje oziroma organizacijo (če jo navedete)",
          "e-poštni naslov",
          "telefonsko številko (če jo navedete)",
          "izbrano storitev",
          "vsebino sporočila (vključno z morebitnimi dodatnimi podatki, ki jih sami vnesete, npr. opis potreb)",
          "podatek o soglasju k obdelavi in čas oddaje obrazca",
        ],
      },
      {
        type: "p",
        text: "Ob obisku spletnega mesta lahko strežniška infrastruktura za dostavo strani obdela tehnične podatke zahteve (npr. IP-naslov, čas zahteve, zahtevani naslov, podatke o brskalniku oziroma uporabniškem agentu). Natančen nabor in hramba teh zapisov sta odvisna od nastavitev ponudnika gostovanja.",
      },
      {
        type: "p",
        text: "Če privolite v analitiko, se lahko obdelajo tudi agregirani oziroma anonimizirani podatki o uporabi strani in tehnični kazalniki učinkovitosti (glejte poglavje o analitiki in Politiko piškotkov).",
      },
      {
        type: "p",
        text: "V lokalni shrambi brskalnika (localStorage) se lahko shranijo tudi nastavitve, ki jih ustvari vaša naprava (npr. izbira teme, odločitev o analitiki, zgodovina pogovora v vodiču). Podrobnosti so v Politiki piškotkov.",
      },
    ],
  },
  {
    id: "namen",
    number: "03",
    title: "Namen obdelave",
    blocks: [
      {
        type: "p",
        text: "Osebne podatke obdelujemo za namene, povezane z vašim povpraševanjem in morebitnim sodelovanjem:",
      },
      {
        type: "list",
        items: [
          "odgovor na povpraševanje in dogovor o posvetu",
          "priprava ponudbe, obsega in terminskega okvira",
          "komunikacija po e-pošti ali telefonu",
          "izvedba dogovorjenih storitev (razvoj, avtomatizacija, infrastruktura, podpora), če se za sodelovanje dogovorimo",
          "izpolnjevanje zakonskih obveznosti (npr. računovodstvo in davki), če nastane poslovno razmerje",
          "zagotavljanje delovanja, varnosti in zanesljivosti spletnega mesta ter preprečevanje zlorab",
          "merjenje obiska in učinkovitosti spletnega mesta — le, če ste privolili v analitiko",
        ],
      },
      {
        type: "p",
        text: "Podatkov ne uporabljamo za oglaševalsko profiliranje in jih ne posredujemo tretjim osebam za njihovo trženje. Marketinških oglaševalskih slikovnih pik (pixelov) na spletnem mestu ne uporabljamo.",
      },
    ],
  },
  {
    id: "podlage",
    number: "04",
    title: "Pravne podlage",
    blocks: [
      {
        type: "p",
        text: "Obdelava temelji na členu 6 Splošne uredbe o varstvu podatkov (GDPR, EU 2016/679). Katera podlaga velja, je odvisno od okoliščin:",
      },
      {
        type: "list",
        items: [
          "člen 6(1)(a) — privolitev: oddaja kontaktnega obrazca s soglasjem k obdelavi za odgovor na povpraševanje; privolitev v merjenje obiska/učinkovitosti (analitika); privolitev lahko kadar koli prekličete, kar ne vpliva na zakonitost obdelave pred preklicem",
          "člen 6(1)(b) — pogodba: obdelava, ki je potrebna za pripravo ali izvedbo pogodbe o storitvah, če se za sodelovanje dogovorimo",
          "člen 6(1)(c) — zakonska obveznost: hrambe in obdelave, ki jih zahtevajo davčni, računovodski ali drugi predpisi, kadar nastane poslovno razmerje",
          "člen 6(1)(f) — zakoniti interes: varnost in zanesljivost spletnega mesta, tehnično delovanje infrastrukture, preprečevanje zlorab ter uveljavljanje ali obramba pravnih zahtevkov; pri tem tehtamo vaše interese in pravice",
        ],
      },
      {
        type: "p",
        text: "Za posebne vrste podatkov iz člena 9 GDPR (npr. zdravstveni podatki) obrazec ni namenjen. Prosimo, da takih podatkov v sporočilu ne pošiljate.",
      },
    ],
  },
  {
    id: "hramba",
    number: "05",
    title: "Hramba podatkov",
    blocks: [
      {
        type: "p",
        text: "Podatke hranimo le toliko časa, kolikor je potrebno za namen obdelave oziroma kolikor zahteva zakon.",
      },
      {
        type: "list",
        items: [
          "Kontaktna povpraševanja in z njimi povezano komunikacijo lahko hranimo največ 12 mesecev po zaključku komunikacije, razen če je daljša hramba potrebna zaradi pogodbenega razmerja, zakonske ali pravne obveznosti oziroma uveljavljanja, izvrševanja ali obrambe pravnih zahtevkov.",
          "Če nastane pogodbeno ali poslovno razmerje, hranimo povezano dokumentacijo toliko časa, kolikor je potrebno za izpolnitev pogodbe, zakonskih obveznosti in morebitnih pravnih zahtevkov.",
          "Računovodski in davčni dokumenti se, kadar nastanejo, hranijo v skladu z veljavnimi davčnimi in računovodskimi predpisi.",
          "Tehnični dnevniki gostovanja se hranijo v skladu z nastavitvami ponudnika infrastrukture in le toliko časa, kolikor je potrebno za varnost, odpravljanje napak in zanesljivost storitve.",
          "Podatki v lokalni shrambi brskalnika ostanejo na vaši napravi, dokler jih ne izbrišete vi ali brskalnik (glejte Politiko piškotkov).",
        ],
      },
    ],
  },
  {
    id: "posredovanje",
    number: "06",
    title: "Posredovanje podatkov",
    blocks: [
      {
        type: "p",
        text: "Osebnih podatkov ne prodajamo, ne oddajamo v najem in jih ne izmenjujemo z oglaševalci. Posredujemo jih le, če je to potrebno za delovanje spletnega mesta, odgovor na povpraševanje ali izpolnitev zakonske obveznosti.",
      },
      {
        type: "p",
        text: "Glede na trenutno produkcijsko ureditev lahko pri obdelavi sodelujejo naslednje kategorije prejemnikov oziroma obdelovalcev:",
      },
      {
        type: "list",
        items: [
          "ponudnik gostovanja in infrastrukture spletnega mesta (Vercel) — za dostavo strani in tehnično delovanje",
          "ponudnik dostave e-pošte (Resend) — za pošiljanje sporočil iz kontaktnega obrazca na naš nabiralnik",
          "ponudnik analitike in merjenja učinkovitosti (Vercel Web Analytics in Vercel Speed Insights) — le, če ste privolili v analitiko",
          "državni organi, če to zahteva zakon ali veljavna odredba",
        ],
      },
      {
        type: "p",
        text: "Kadar zunanji izvajalec obdeluje podatke v našem imenu, mora biti z njim urejeno razmerje v skladu s členom 28 GDPR. Natančni pravni podatki posameznih ponudnikov (sedež, lokacija strežnikov, certifikati) so objavljeni pri ponudnikih; tukaj jih ne ponavljamo, da ne bi navedli neverificiranih podrobnosti.",
      },
    ],
  },
  {
    id: "prenosi",
    number: "07",
    title: "Prenosi izven EU/EGP",
    blocks: [
      {
        type: "p",
        text: "Spletno mesto gostujemo pri ponudniku infrastrukture, e-pošto iz kontaktnega obrazca pa dostavimo prek specializirane storitve. Ti ponudniki lahko obdelujejo podatke tudi zunaj Evropske unije oziroma Evropskega gospodarskega prostora.",
      },
      {
        type: "p",
        text: "Kadar pride do prenosa v tretjo državo, se prenosi izvajajo le, če so zagotovljeni ustrezni ukrepi iz poglavja V GDPR (npr. sklep o ustreznosti, standardne pogodbene klavzule ali druga jamstva). Natančen mehanizem prenosa določa vsakokratni ponudnik v svojih pogojih in pogodbah o obdelavi.",
      },
    ],
  },
  {
    id: "analitika",
    number: "08",
    title: "Analitika in privolitev",
    blocks: [
      {
        type: "p",
        text: "Osnovno delovanje spletnega mesta (prikaz vsebine, tema, kontaktni obrazec) ni pogojeno s privolitvijo v analitiko.",
      },
      {
        type: "p",
        text: "Ob prvem obisku se prikaže pasica, v kateri lahko izberete »Sprejmem« ali »Samo nujno«. Izbira se shrani v lokalni shrambi brskalnika pod ključem ju-tan-analytics.",
      },
      {
        type: "list",
        items: [
          "če izberete »Sprejmem«, se aktivirata Vercel Web Analytics in Vercel Speed Insights",
          "če izberete »Samo nujno«, se ta orodja ne naložijo",
          "dokler odločitve ne sprejmete, se analitika ne aktivira",
        ],
      },
      {
        type: "p",
        text: "Ločenega nastavitvenega zaslona za spremembo privolitve trenutno ni. Če želite odločitev spremeniti, v nastavitvah brskalnika izbrišite shranjene podatke tega spletnega mesta oziroma ključ ju-tan-analytics; ob naslednjem obisku se pasica znova prikaže.",
      },
      {
        type: "p",
        text: "Podrobnosti o shrambi v brskalniku so v Politiki piškotkov.",
      },
    ],
  },
  {
    id: "piskotki",
    number: "09",
    title: "Piškotki in shramba v brskalniku",
    blocks: [
      {
        type: "p",
        text: "Javno spletno mesto se v veliki meri opira na lokalno shrambo brskalnika (localStorage), ne na klasične piškotke. Za prijavo v platformo se lahko uporabijo tudi sejni piškotki.",
      },
      {
        type: "p",
        text: "Podrobnosti o vrstah shrambe, namenih in trajanju so na ločeni strani.",
      },
    ],
  },
  {
    id: "pravice",
    number: "10",
    title: "Vaše pravice",
    blocks: [
      {
        type: "p",
        text: "V skladu z GDPR in Zakonom o varstvu osebnih podatkov (ZVOP-2) imate kot posameznik, na katerega se nanašajo osebni podatki, naslednje pravice:",
      },
      {
        type: "rights",
        items: [
          {
            title: "Pravica do vpogleda",
            text: "Zahtevate lahko potrditev, ali obdelujemo vaše podatke, in kopijo teh podatkov ter informacije o namenih, prejemnikih in rokih hrambe (člen 15 GDPR).",
          },
          {
            title: "Pravica do popravka",
            text: "Zahtevate lahko popravek netočnih podatkov ali dopolnitev nepopolnih podatkov (člen 16 GDPR).",
          },
          {
            title: "Pravica do izbrisa",
            text: "Zahtevate lahko izbris, kadar podatki niso več potrebni, je privolitev preklicana in ni druge podlage, je obdelava nezakonita ali to zahteva zakon. Pravica ni absolutna, na primer kadar je hramba potrebna zaradi pravnih obveznosti ali uveljavljanja pravnih zahtevkov (člen 17 GDPR).",
          },
          {
            title: "Pravica do omejitve obdelave",
            text: "V določenih primerih (npr. spor o točnosti podatkov) lahko zahtevate, da obdelavo začasno omejimo (člen 18 GDPR).",
          },
          {
            title: "Pravica do prenosljivosti",
            text: "Kadar obdelava temelji na privolitvi ali pogodbi in poteka avtomatizirano, lahko zahtevate, da vam podatke posredujemo v strojno berljivi obliki ali — kjer je tehnično izvedljivo — jih prenesemo drugemu upravljavcu. Pravica se uporablja v obsegu, ki ga dopušča člen 20 GDPR.",
          },
          {
            title: "Pravica do ugovora",
            text: "Kadar obdelava temelji na zakonitem interesu, lahko ugovarjate iz razlogov, povezanih z vašim posebnim položajem. Ugovor presodimo in obdelavo prenehamo, razen če izkažemo nujne zakonite razloge (člen 21 GDPR).",
          },
          {
            title: "Pravica do preklica soglasja",
            text: "Privolitev lahko kadar koli prekličete. Preklic ne vpliva na zakonitost obdelave, ki je potekala pred preklicem (člen 7 GDPR).",
          },
          {
            title: "Pravica do pritožbe",
            text: "Če menite, da obdelava krši predpise, lahko vložite pritožbo pri nadzornem organu. V Sloveniji je to Informacijski pooblaščenec. Podrobnosti so v kartici Nadzorni organ na tej strani (člen 77 GDPR).",
          },
        ],
      },
    ],
  },
  {
    id: "uveljavitev",
    number: "11",
    title: "Kako uveljaviti pravice",
    blocks: [
      {
        type: "p",
        text: `Pravice uveljavite tako, da nam pišete na ${privacyGdprEmail}. V sporočilu navedite, katero pravico uveljavljate, in podatke, ki nam omogočajo, da vas zanesljivo prepoznamo.`,
      },
      {
        type: "p",
        text: "Na zahtevo odgovorimo brez nepotrebnega odlašanja, praviloma v enem mesecu. Rok lahko v skladu s členom 12 GDPR podaljšamo za dodatna dva meseca, če je zahteva kompleksna ali jih je več. O podaljšanju vas obvestimo.",
      },
      {
        type: "p",
        text: "Če zahteve ne moremo izpolniti, vas obvestimo o razlogih in o možnosti pritožbe pri Informacijskem pooblaščencu.",
      },
      {
        type: "note",
        text: `Kontakt za varstvo osebnih podatkov: ${privacyGdprEmail}.`,
      },
    ],
  },
  {
    id: "varnost",
    number: "12",
    title: "Varnost",
    blocks: [
      {
        type: "p",
        text: "Uporabljamo tehnične in organizacijske ukrepe, ki so primerni tveganju obdelave. Ukrepi se lahko spreminjajo z razvojem infrastrukture.",
      },
      {
        type: "list",
        items: [
          "prenos po HTTPS/TLS na spletnem mestu",
          "omejen dostop do podatkov po načelu najmanjših potrebnih pravic",
          "organizacijski ukrepi: dostop samo za osebe, ki podatke potrebujejo za odgovor ali izvedbo storitve",
          "zaščita povezav in sistemov v okviru zmožnosti uporabljenih ponudnikov infrastrukture in e-pošte",
        ],
      },
      {
        type: "p",
        text: "Nobena spletna komunikacija ni popolnoma brez tveganja. Ob sumu na incidente ravnamo v skladu z veljavnimi obveznostmi obveščanja.",
      },
    ],
  },
  {
    id: "spremembe",
    number: "13",
    title: "Spremembe politike",
    blocks: [
      {
        type: "p",
        text: "To politiko lahko občasno posodobimo, če se spremenijo predpisi, nameni obdelave ali naši postopki. Nova različica velja z datumom, ki je naveden kot zadnja posodobitev na vrhu te strani.",
      },
      {
        type: "p",
        text: "Pri bistvenih spremembah bomo na spletnem mestu objavili obvestilo oziroma, kjer je to smiselno, obvestili posameznike, ki so nam predhodno posredovali kontakt.",
      },
      {
        type: "p",
        text: "Priporočamo, da stran občasno pregledate.",
      },
    ],
  },
];

export const privacySupervisor = {
  title: "Nadzorni organ",
  body: "Če menite, da obdelava vaših osebnih podatkov krši GDPR ali ZVOP-2, imate pravico vložiti pritožbo pri Informacijskem pooblaščencu Republike Slovenije. Pritožba pri nadzornem organu ne posega v druga pravna sredstva.",
  authority: "Informacijski pooblaščenec RS",
  details: "Dunajska cesta 22, 1000 Ljubljana · gp.ip@ip-rs.si",
  url: "https://www.ip-rs.si",
  urlLabel: "www.ip-rs.si",
} as const;

export const privacyDisclaimer =
  "Ta politika zasebnosti velja za spletno mesto JU-TAN in z njo povezane javne komunikacije, kot so opisane v tem dokumentu. Ob spremembi postopkov obdelave bomo besedilo posodobili.";

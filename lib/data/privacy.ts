import { company } from "@/lib/data/company";
import { siteConfig } from "@/lib/config";

export const privacyLastUpdated = "15. 9. 2026";

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

export const privacyPlaceholder = "[dopolniti]";

export const controllerFields = [
  { label: "Blagovna znamka", value: company.name, pending: false },
  { label: "Naziv podjetja", value: privacyPlaceholder, pending: true },
  { label: "Naslov", value: privacyPlaceholder, pending: true },
  { label: "Matična številka", value: privacyPlaceholder, pending: true },
  { label: "Davčna številka", value: privacyPlaceholder, pending: true },
  { label: "E-pošta", value: company.contact.email, pending: false },
  { label: "Telefon", value: company.contact.phone, pending: false },
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
        text: "Upravljavec osebnih podatkov je oseba, ki določa namene in sredstva obdelave. Za podatke, ki jih zberemo prek spletnega mesta in kontaktnega obrazca, je upravljavec JU-TAN.",
      },
      {
        type: "p",
        text: "Spodnji podatki so delno že javno navedeni na spletnem mestu. Pravni identifikatorji podjetja (polni naziv, sedež, matična in davčna številka) so označeni kot mesta za dopolnitev, dokler jih JU-TAN ne potrdi.",
      },
      {
        type: "note",
        text: "Če imate imenovanega pooblaščenca za varstvo podatkov (DPO), njegove kontaktne podatke vnesite tukaj. Če DPO ni imenovan, tega polja ne izpolnjujte in te navedbe ne objavljajte.",
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
        text: "Zbiramo samo podatke, ki so potrebni za odgovor na vaše povpraševanje, izvedbo storitev ali zagotavljanje delovanja spletnega mesta. Obseg je odvisen od tega, kaj nam sami posredujete in katere tehnične zapise ustvari obisk.",
      },
      {
        type: "p",
        text: "Prek kontaktnega obrazca lahko prejmemo:",
      },
      {
        type: "list",
        items: [
          "ime in priimek",
          "podjetje oziroma organizacijo",
          "e-poštni naslov",
          "telefonsko številko, če jo navedete",
          "izbrano storitev",
          "vsebino sporočila",
          "podatek o soglasju in času oddaje obrazca",
        ],
      },
      {
        type: "p",
        text: "Ob obisku spletnega mesta se lahko samodejno obdelajo tudi tehnični podatki, ki jih brskalnik ali strežnik običajno zabeleži:",
      },
      {
        type: "list",
        items: [
          "IP-naslov",
          "čas obiska in zahtevani naslov strani",
          "vrsta in različica brskalnika ter naprave",
          "dnevniški zapisi strežnika (access in error logi)",
        ],
      },
      {
        type: "note",
        text: "Natančen nabor tehničnih dnevnikov je odvisen od gostovanja in orodij, ki jih JU-TAN dejansko uporablja. Seznam ponudnikov dopolnite v poglavju o posredovanju.",
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
        text: "Osebne podatke obdelujemo izključno za namene, ki so povezani z vašim povpraševanjem in morebitnim sodelovanjem:",
      },
      {
        type: "list",
        items: [
          "odgovor na povpraševanje in dogovor o posvetu",
          "priprava ponudbe, obsega in terminskega okvira",
          "komunikacija po e-pošti ali telefonu",
          "izvedba dogovorjenih storitev (razvoj, avtomatizacija, infrastruktura, podpora)",
          "izpolnjevanje zakonskih obveznosti (npr. računovodstvo in davki, če pride do poslovnega razmerja)",
          "zagotavljanje varnosti spletnega mesta, preprečevanje zlorab in odpravljanje napak",
        ],
      },
      {
        type: "p",
        text: "Podatkov ne uporabljamo za oglaševalsko profiliranje in jih ne posredujemo tretjim osebam za njihovo trženje.",
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
          "člen 6(1)(a) — privolitev: oddaja kontaktnega obrazca in soglasje k obdelavi za odgovor na povpraševanje; privolitev lahko kadar koli prekličete, kar ne vpliva na zakonitost obdelave pred preklicem",
          "člen 6(1)(b) — pogodba: obdelava, ki je potrebna za pripravo ali izvedbo pogodbe o storitvah, če se za sodelovanje dogovorimo",
          "člen 6(1)(c) — zakonska obveznost: hrambe in obdelave, ki jih zahtevajo davčni, računovodski ali drugi predpisi, kadar nastane poslovno razmerje",
          "člen 6(1)(f) — zakoniti interes: varnost spletnega mesta, preprečevanje zlorab, tehnični dnevniki in uveljavljanje ali obramba pravnih zahtevkov; pri tem tehtamo vaše interese in pravice",
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
        text: "Podatke hranimo le toliko časa, kolikor je potrebno za namen obdelave oziroma kolikor zahteva zakon. Spodnji roki so okvirni in jih mora JU-TAN uskladiti s svojimi dejanskimi postopki, pogodbami in notranjimi pravili.",
      },
      {
        type: "list",
        items: [
          "Kontaktna povpraševanja: okvirno do 12 mesecev po zadnjem stiku, če sodelovanje ne steče — ali do preklica soglasja, če ni druge podlage za hrambo",
          "Pogodbena dokumentacija (ponudbe, pogodbe, tehnična specifikacija): okvirno ves čas trajanja pogodbe in nato še zastaralni rok za civilne terjatve; v Sloveniji je to pogosto 5 let, v posameznih primerih drugače — [dopolniti po pravnem pregledu]",
          "Računovodski in davčni dokumenti: okvirno 10 let, kolikor to zahtevajo davčni in računovodski predpisi, če pride do izdaje računa",
          "Varnostni in strežniški dnevniki: okvirno od 30 dni do 12 mesecev, odvisno od nastavitev gostovanja — [dopolniti glede na dejanskega ponudnika]",
        ],
      },
      {
        type: "note",
        text: "Roke hrambe pred objavo potrdite. Če uporabljate dodatne evidence (CRM, projektno orodje, arhiv e-pošte), jih tukaj navedite z dejanskim rokom.",
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
        text: "Obdelovalci in prejemniki, ki jih je treba dopolniti z dejanskimi ponudniki JU-TAN:",
      },
      {
        type: "list",
        items: [
          "gostovanje spletnega mesta (hosting) — [dopolniti: ponudnik in država obdelave]",
          "ponudnik e-pošte za prejem in pošiljanje sporočil — [dopolniti]",
          "oblačne storitve za delovanje aplikacije ali varnostne kopije — [dopolniti, če se uporabljajo]",
          "IT partnerji, ki vzdržujejo infrastrukturo, izključno po pogodbi o obdelavi — [dopolniti, če obstajajo]",
          "državni organi, če to zahteva zakon ali veljavna odredba",
        ],
      },
      {
        type: "p",
        text: "Kadar zunanji izvajalec obdeluje podatke v našem imenu, mora biti z njim sklenjena pogodba o obdelavi v skladu s členom 28 GDPR.",
      },
    ],
  },
  {
    id: "prenosi",
    number: "07",
    title: "Prenosi izven EU",
    blocks: [
      {
        type: "p",
        text: "Prednost dajemo obdelavi v Evropski uniji oziroma Evropskem gospodarskem prostoru. Če kateri od ponudnikov obdeluje podatke v tretji državi, je prenos dopusten le, če je zagotovljena ustrezna raven varstva.",
      },
      {
        type: "list",
        items: [
          "sklep Komisije o ustreznosti za ciljno državo",
          "standardne pogodbene klavzule (SCC) in, kjer je potrebno, dodatni ukrepi",
          "druga jamstva iz poglavja V GDPR (npr. zavezujoča poslovna pravila)",
        ],
      },
      {
        type: "note",
        text: "Navedite, ali JU-TAN dejansko uporablja ponudnike v ZDA ali drugih tretjih državah (npr. e-pošta, analitika, gostovanje). Če prenosov ni, to izrecno zapišite. Ne objavljajte imen ponudnikov, dokler niso potrjeni.",
      },
    ],
  },
  {
    id: "piskotki",
    number: "08",
    title: "Piškotki",
    blocks: [
      {
        type: "p",
        text: "Ta politika ne opisuje posameznih piškotkov. Podrobnosti o vrstah piškotkov, namenu, trajanju in možnostih upravljanja so na ločeni strani.",
      },
    ],
  },
  {
    id: "pravice",
    number: "09",
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
            text: "Zahtevate lahko izbris, kadar podatki niso več potrebni, je privolitev preklicana in ni druge podlage, je obdelava nezakonita ali to zahteva zakon. Pravica ni absolutna, na primer kadar je hramba potrebna za pravne obveznosti (člen 17 GDPR).",
          },
          {
            title: "Pravica do omejitve obdelave",
            text: "V določenih primerih (npr. spor o točnosti podatkov) lahko zahtevate, da obdelavo začasno omejimo (člen 18 GDPR).",
          },
          {
            title: "Pravica do prenosljivosti",
            text: "Kadar obdelava temelji na privolitvi ali pogodbi in poteka avtomatizirano, lahko zahtevate, da vam podatke posredujemo v strojno berljivi obliki ali — kjer je tehnično izvedljivo — jih prenesemo drugemu upravljavcu (člen 20 GDPR).",
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
    number: "10",
    title: "Kako uveljaviti pravice",
    blocks: [
      {
        type: "p",
        text: `Pravice uveljavite tako, da nam pišete na ${company.contact.email} ali pokličete na ${company.contact.phone}. V sporočilu navedite, katero pravico uveljavljate, in podatke, ki nam omogočajo, da vas zanesljivo prepoznamo.`,
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
        type: "p",
        text: `Kontakt za vprašanja o zasebnosti: ${company.contact.email}, ${company.contact.hours}.`,
      },
    ],
  },
  {
    id: "varnost",
    number: "11",
    title: "Varnost",
    blocks: [
      {
        type: "p",
        text: "Uporabljamo tehnične in organizacijske ukrepe, ki so primerni tveganju obdelave. Ukrepi se lahko spreminjajo z razvojem infrastrukture; navedeni so kot trenutna praksa, ki jo JU-TAN mora uskladiti z dejanskim okoljem.",
      },
      {
        type: "list",
        items: [
          "prenos po HTTPS/TLS (SSL) na spletnem mestu",
          "šifriranje povezav do strežnika in e-pošte, kjer to omogoča ponudnik",
          "omejen dostop do podatkov po načelu najmanjših potrebnih pravic",
          "varnostne kopije glede na nastavitve gostovanja — [dopolniti pogostost in lokacijo]",
          "organizacijski ukrepi: dostop samo za osebe, ki podatke potrebujejo za odgovor ali izvedbo storitve",
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
    number: "12",
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
        text: "Priporočamo, da stran občasno pregledate. Nadaljnja uporaba spletnega mesta po posodobitvi pomeni, da ste seznanjeni z veljavno različico.",
      },
    ],
  },
];

export const privacySupervisor = {
  title: "Nadzorni organ",
  body: "Če menite, da obdelava vaših osebnih podatkov krši GDPR ali ZVOP-2, imate pravico vložiti pritožbo pri Informacijskem pooblaščencu Republike Slovenije. Pritožba pri nadzornem organu ne posega v druga pravna sredstva.",
  authority: "Informacijski pooblaščenec RS",
  url: "https://www.ip-rs.si",
  urlLabel: "www.ip-rs.si",
} as const;

export const privacyDisclaimer =
  "Ta politika zasebnosti predstavlja informativno predlogo. Pred objavo priporočamo pregled in potrditev s strani pravnega strokovnjaka, da bo v celoti usklajena z dejanskimi postopki podjetja JU-TAN.";

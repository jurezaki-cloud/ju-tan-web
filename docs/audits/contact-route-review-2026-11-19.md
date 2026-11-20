# JU-TAN Studio — tehnični pregled kontaktne poti

Datum: 19. 11. 2026  
Stanje: samo analiza na razvojni veji. Brez produkcijskih sprememb.

## Kaj je preverjeno v kodi

- `components/contact/ContactForm.tsx`: storitev iz parametra `?service=` se preslika samo iz dovoljenega nabora; obrazec uporablja skupno shemo za preverjanje podatkov in pokaže sporočila napak.
- `components/contact/ContactSuccess.tsx`: po uspešni oddaji se pokaže potrditveno sporočilo in fokus se premakne nanj.
- `app/api/contact/route.ts`: preverja JSON in podatke; e-pošto pošlje prek Resend; `success: true` pošlje šele ob potrjenem sprejemu e-pošte. Napaka beleženja agregirane statistike ne povzroči ponovne oddaje že sprejetega sporočila.
- `lib/inquiry-stats.ts`: hrani agregirane dnevne števce, brez imen, e-poštnih naslovov ali sporočil.

## Prioritetne ugotovitve

### P1: Omejevanje zahtev ni skupno med instancami

**Dokaz:** `lib/rate-limit.ts` uporablja `MemoryRateLimitStore` z `Map<string, number[]>`, ki se ustvari znotraj strežniškega procesa. Izvorna koda določa mejo 8 poskusov v 10 minutah.

**Tveganje:** Pri razdeljenih strežniških instancah ali ponovnih zagonih ta pomnilnik ni skupen oziroma trajen. To pomeni, da razpoložljivost in učinkovitost omejevanja v produkciji ni mogoče potrditi samo z lokalnimi testi.

**Predlog:** Ločena tehnična sprememba: zunanji distribuirani hranilnik omejitev ali ustrezna infrastruktura. Pred spremembo določiti pravilno obnašanje ob izpadu hranilnika in zahteve za varstvo podatkov.

### P1 za preverjanje: Zaupanje IP glavam

**Dokaz:** `clientKey()` uporabi `x-real-ip`, sicer prvi IP iz `x-forwarded-for`.

**Neznanka:** Dejanska Vercel konfiguracija in normalizacija posredovanih glav nista bili preizkušeni. Brez tega ni mogoče trditi, da ju lahko obiskovalec ponaredi ali da sta varni.

**Predlog:** Preveriti uradni model zaupanja glav za nameščeni Vercel projekt in ga preizkusiti v izoliranem okolju. Spremembe omejevanja uvesti šele po preverjanju.

### P2: Neveljavne zahteve zmanjšujejo kvoto

**Dokaz:** `isRateLimited(clientKey(req))` se izvede pred razčlenjevanjem in validacijo JSON ter pred preverjanjem honeypota.

**Tveganje:** Neveljavna ali avtomatizirana zahteva lahko zmanjša kvoto za isti identifikator IP. Pri skupnih javnih IP naslovih lahko to vpliva na resnična povpraševanja.

**Predlog:** Narediti načrt večplastne zaščite (robna omejitev, validacija, omejitve ponudnika e-pošte, zaščita pred zlorabo), nato preveriti z nežnimi kontroliranimi testi. Na živem sistemu ne pošiljati množičnih testnih zahtev.

### P2: Preverjanje dejanske dostave

**Dokaz:** API vrne potrditev ob identifikatorju sprejetega sporočila v Resend. To dokazuje sprejem ponudnika, ne nujno dostave do prejemnikovega nabiralnika.

**Predlog:** Ločen ročni end-to-end test do dovoljenega prejemnika; preveriti tudi obnašanje pri `429`, `503`, `400` in `500`, brez motenja produkcijskih strank.

## Kaj je v PR #87 že pripravljeno

- Izboljšani fokus in kontrast CTA gumbov na referencah, grafičnih storitvah in logotipih.
- Digitalni ekosistem na domači strani zdaj uporablja dejanske notranje povezave.
- `npm run test:seo` vključuje dodatna preverjanja celotnega mesta.
- Zadnji prejšnji pregled: 16 izvedenih testov, Vercel gradnja READY in GitHub status success.

## Kaj ni spremenjeno

Nobene spremembe strežniškega API-ja, omejevanja zahtev, pošiljanja e-pošte, baze, `main` ali produkcijske objave. Varnostna analiza ni penetracijski test in ne dokazuje napada.

## Priporočilo za naslednji korak

1. Zaključiti vizualni pregled PR #87 in pridobiti izrecno dovoljenje pred združitvijo.
2. Kontaktni rate-limit obravnavati kot **ločeno** spremembo z načrtom in testi, da ga ne združujemo s kozmetičnimi SEO/UX popravki.
3. Sveže podatke Google Search Console pridobiti po ponovni vzpostavitvi dostopa (GSC Wizard trenutno zahteva naročnino).

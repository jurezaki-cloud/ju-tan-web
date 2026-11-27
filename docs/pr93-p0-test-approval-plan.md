# ju-tan-web-p0-test — načrt pred ustvarjanjem storitev

Datum preverjanja javnih cen: 27. 11. 2026. Ta dokument je priprava, ne dokaz ustvarjenih storitev. Nobena storitev, plačljiv paket, baza, licenca ali objava ni ustvarjena s tem zapisom. Velja samo veja fix/pr93-readiness-security-test; PR #93 in main ostaneta nespremenjena.

## Predvideni mesečni stroški in odobritev

USD, brez davkov in pretvorbe valut. Javni ceniki niso vpogled v račune stranke. Predpostavke: en razvijalec, največ 100 sintetičnih oddaj mesečno, največ 20 e-poštnih sporočil na dan, pod 1 GB na testno bazo in pod 0,1 GB kontaktnih objektov. Redni klic vsakih pet minut pomeni 288 klicev/dan oziroma 8.640 v 30 dneh. Delavec trenutno pregleduje zgodovino predala, zato strošek operacij raste tudi s številom starih zapisov, ne samo z novimi oddajami.

- Vercel: javni Pro začne pri 20 USD/mesec in vključuje 20 USD porabniškega dobroimetja. Če je ustrezen Pro že plačan in ne dodamo sedeža, nove naročnine zgolj za projekt ne predpostavljamo; dodatna poraba pa ni nujno nič. Za novo ločeno Pro ekipo je osnova 20 USD/mesec za začetni paket. Komercialnega testa ne načrtujemo na osebnem Hobby paketu.
- Blob: 0,023 USD/GB-mesec; preproste operacije 0,40 USD/milijon, napredne 5 USD/milijon po javnem ceniku. Pri 0,1 GB je gola hramba 0,0023 USD/mesec, brez operacij, prenosa in funkcij. Pro dobroimetje si lahko delijo druge porabe; to ni zagotovljena brezplačna kvota novega projekta.
- Neon Free: 0 USD, do 100 CU-ur in 1 GB na projekt/mesec. Predlagana sta dva nova prazna projekta: kontaktni in Office testni. Ob izčrpanju kvote test ustavimo; brez samodejne nadgradnje. Če je organizacija že plačljiva, najprej preverimo obračun: novega projekta ni varno razglasiti za Free. Launch: 0,106 USD/CU-uro in 0,35 USD/GB-mesec, dodatna zgodovina se obračuna posebej.
- Resend Free: brezplačni paket 3.000 sporočil/mesec, največ 100/dan; nov API ključ ni nova ločena kvota. Obstoječa ekipa si kvoto deli. Priporočena izolacija je nova testna ekipa, če jo račun dovoljuje. Plačljivega paketa ne vključujemo. Testni prejemnik naj bo že razpoložljiv odobren predal; nove plačljive poštne storitve ne naročimo.
- Razporejanje in alarmi: predlagana sta Vercel Schedules v novem projektu in ločen nadzor zadnjega uspešnega zagona. Dokler ne potrdimo prikazane cene Schedules in izbranega alarmnega kanala, skupni strošek NI dokončno potrjen. Ne bomo ustvarili neocenjene plačljive storitve ali Ryze agentskega opravila za tehnične klice.

Predvidena osnova: 20 USD/mesec ob novi Pro ekipi, ali brez dodatne fiksne naročnine ob že ustrezni obstoječi Pro ekipi, PLUS dejanska poraba Vercela ter morebitno posebej odobreno razporejanje/nadzor. To ni ponudba s fiksno zgornjo mejo. Predlagan kontrolni prag porabe novega projekta: 5 USD/mesec, z opozorili; ni trda omejitev in ne vključuje naročnine. Nobenega praga ali samodejnega ustavljanja ne nastavimo na celotno obstoječo ekipo, ker bi lahko prizadelo produkcijo. Odobritev plačljivega paketa in končnega stroška je še potrebna.

Viri: https://vercel.com/pricing ; https://vercel.com/docs/pricing ; https://vercel.com/docs/spend-management ; https://neon.com/pricing ; https://resend.com/pricing ; https://vercel.com/docs/schedules . Cene Schedules bomo preverili v uradnem ceniku oziroma pred potrditvijo v računu, ne sklepali iz cen starega Cron.

## 1. Ločen Vercel projekt

1. Lastnik se prijavi na vercel.com; prijavo, dodatno preverjanje in morebitno plačilo opravi sam. Agent lahko nato vodi nastavitve v skupnem brskalniku.
2. Pred ustvarjanjem pregledamo ekipo, njen paket in skupne Environment Variables. Če skupnih produkcijskih skrivnosti ni mogoče izključiti samo za novi projekt, uporabimo novo ekipo in najprej potrdimo strošek.
3. Add New → Project → isti repozitorij, NE Clone obstoječega projekta. Ime ju-tan-web-p0-test. Izvor izključno fix/pr93-readiness-security-test; brez samodejne prve objave main. Če uvoz ponuja le main in takojšen Deploy, se ustavimo in izberemo varen uvoz/CLI po preverjeni dokumentaciji.
4. Brez lastne domene, brez uvoza okolja in brez samodejnih Marketplace povezav. Vključimo Deployment Protection. Preverimo celoten seznam imen in obsegov skrivnosti, tudi podedovanih; noben produkcijski podatek ne sme biti prisoten.
5. Kandidat vsebuje staro licenčno cron nastavitev. V izoliranem testnem kandidatu jo je treba izključiti iz testne konfiguracije PRED objavo, brez spreminjanja obstoječega projekta ali licenčne kode. Pripraviti tudi minimalen seznam dovoljenih strežniških ciljnih gostiteljev za teste.
6. Ne uporabljamo Vercel Production/Promote niti v testnem projektu brez pojasnjene ločene odobritve. Prva objava je zaščiten Preview tega projekta, ne produkcijska objava. Najprej pregled nastavitev, nato posebej potrjen testni deploy.

## 2. Namenska Neon baza

1. console.neon.tech → New project ju-tan-contact-p0-test; evropska regija, nova prazna baza ju_tan_contact_p0_test in nova vloga contact_p0_test. Ne ustvarimo veje iz produkcijskega projekta.
2. Preverimo Free oziroma dejanski organizacijski paket, scale-to-zero in omejitve. V Connect izberemo izključno novo bazo in pooled SSL povezavo.
3. Lastnik povezavo vnese samo v novi Vercel projekt pod CONTACT_DATABASE_URL. Brez DATABASE_URL nadomestila in brez NEXT_PUBLIC predpone. Skrivnosti ne pošilja v klepet.
4. Šele po potrditvi novega ciljnega projekta/baze izvedemo scripts/sql/contact-idempotency.sql v novi prazni bazi. Ni migracije nobene obstoječe baze. Zapišemo ime cilja in čas, ne povezovalnega niza.
5. Office dobi drug nov prazen Neon projekt ju-tan-office-p0-test; nobena vloga ali baza ni skupna kontaktom. Njegova začetna shema in testna licenca potrebujeta pregled pred izvedbo.

## 3. Zasebna šifrirana shramba

1. V novem projektu Storage → Create Storage → Blob → Private, ime ju-tan-contact-p0-test. Ne povežemo Office ali backup shrambe.
2. Nov namenski token v CONTACT_INBOX_BLOB_TOKEN. Adapter zavrne enako vrednost v BLOB_READ_WRITE_TOKEN; generičnega tokena v kontaktnem okolju ne nastavimo. Preverimo, da povezava ni samodejno dodala drugih produkcijskih skrivnosti.
3. Lastnik lokalno ustvari 32 naključnih bajtov v 64 hex znakih; vnese CONTACT_INBOX_ENCRYPTION_KEY in shrani rezervno kopijo v upravljalnik skrivnosti. Drug naključen niz vsaj 32 znakov v CONTACT_WORKER_SECRET. Noben ključ ni kopiran iz Office.
4. CONTACT_DURABLE_INBOX=1. Za vsako sintetično oddajo potrdimo, da objekt ni javno berljiv in da surovi objekt ne vsebuje imena, e-pošte ali sporočila. Ponovno branje z veljavnim ključem obnovi izvorno vsebino; napačen ključ ne sme dati uspeha.
5. Test ostane s sintetičnimi podatki. Pred resničnimi podatki določimo odgovorno osebo, hrambo in dovoljen postopek izbrisa. Ta načrt ne dovoljuje brisanja zapisov.

## 4. Testni Resend in predal

1. Lastnik se prijavi na resend.com in izbere novo testno ekipo, če je mogoča, sicer dokumentiramo deljene kvote. Pregledamo že potrjenega pošiljatelja. Brez sprememb obstoječega DNS/MX; če potrebuje novo testno domeno, se ustavimo za ločeno odobritev.
2. API Keys → Create API Key: ju-tan-web-p0-test, Sending access, omejitev na potrjeno testno domeno. Ključ neposredno v RESEND_API_KEY novega projekta.
3. EMAIL_FROM = točen odobren naslov potrjenega pošiljatelja. CONTACT_EMAIL_TO naj bo najprej delivered@resend.dev (simulacija), nato za ločen sklop novih oddaj odobren dejanski testni predal. Lastnik poda naslov in dostop, ne gesla v klepetu. Ne uporabljamo info@ju-tan.com.
4. Prejemnika ne spreminjamo sredi ponavljanja obstoječih oddaj. Pripravimo čiste testne podatke za vsak sklop; starih zapisov ne brišemo. Primerjamo Resend Accepted, Delivered in dejanski prejem; testni naslov resend.dev sam ni dokaz dejanskega predala.

## 5. Dostava ob izpadu kontaktne baze

Za oba obrazca po eno oddajo z zdravo bazo, nato z izpuščeno oziroma neveljavno CONTACT_DATABASE_URL SAMO v testni konfiguraciji. Nikoli ne ustavimo Neon produkcije. Pri zdravem Resendu pričakujemo en potrjen prejem in trajen receipt kljub izpadu baze. Nato simuliramo izpad Resenda z neveljavnim TESTNIM ključem: en trajen intent, uspešno queued stanje, brez conversionId. Obnovimo isti testni ključ, sprožimo zaščiten delavec in dokažemo en prejem. Ponovni zagon in osvežitev ne smeta povzročiti druge dostave. Če je nedosegljiva tudi zasebna shramba, mora biti odgovor neuspešen, ne lažna potrditev. Meritev časa preizkusa ne šteje za zagotovljeno razpoložljivost storitve.

## 6. Tag Assistant: osem primerov

Vsak primer v novem profilu. Obvezno kontaktno soglasje ostane ločeno od merilnih izbir.

| Primer | Obrazec | Analitika | Oglasi |
|---|---|---|---|
| 1 | Kontakt | ne | ne |
| 2 | Kontakt | da | ne |
| 3 | Kontakt | ne | da |
| 4 | Kontakt | da | da |
| 5 | Vodič → Želim ponudbo | ne | ne |
| 6 | Vodič → Želim ponudbo | da | ne |
| 7 | Vodič → Želim ponudbo | ne | da |
| 8 | Vodič → Želim ponudbo | da | da |

Za vseh osem: potrjena oddaja, queued, napaka, dvojni klik, refresh, izrecna obnovitev in sprememba soglasja. Brez soglasja za analitiko ni analitičnega dogodka. Brez oglasnega soglasja ni oglasnega dogodka. Queued nikoli ne sproži konverzije; delavec je ne pošlje naknadno.

V tagassistant.google.com povežemo samo odobren Preview. Trenutna varovalka blokira Google Ads v Preview, zato pričakujemo nič zahtev na produkcijsko konverzijo v VSEH osmih primerih, tudi ob oglasnem soglasju. Dokaz pozitivnega dogodka: obstoječi lokalni prestreženi testi. Za resničen pozitivni Google dogodek potrebujemo ločeno testno merilno akcijo/račun in izrecno, samo testno konfiguracijo cilja; dokler tega ni, ta del ostane BLOCKED, ne PASS. Ne vključimo NEXT_PUBLIC_GOOGLE_ADS_LOCAL_TEST na gostovanem testu, ne odstranimo varovalke in ne uporabimo produkcijskega cilja. Google Ads kampanje ostanejo nedotaknjene.

## 7. Office in testna licenca

1. Ločen Office Neon projekt in prazna shema, samo sintetični uporabniki. Nastavimo LICENSING_DATABASE_URL, ne produkcijskega DATABASE_URL; nove JU_TAN_LICENSE_TOKEN_SECRET, JU_TAN_LICENSE_KEY_PEPPER, JU_TAN_DOWNLOAD_PASSWORD in JU_TAN_DOWNLOAD_SESSION_SECRET. Vsaka skrivnost neodvisna, primerne dolžine za obstoječe validacije.
2. Lastnik odobri oziroma zagotovi samo sandbox testno licenco ter testno napravo. Ustvarjanje/aktivacija ne sme uporabiti obstoječe licence. Preverimo, da odjemalec Office res kaže na sandbox, ne na trdo nastavljen produkcijski naslov; sicer STOP.
3. Brez seje zavrnitev; napačno geslo zavrnitev; pravilna testna seja; pripravljeni neveljavni/iztekli testni primeri; veljavna testna licenca; odjava/potek seje; kontaktni izpad ne vpliva na Office. Nobenega prilagajanja licenčne kode ali pravic za uspešen test.
4. Prijava/2FA in vnos testne licence sta lastnikova koraka, testna namizna aplikacija pa zahteva njegovo napravo. Agent lahko vodi brskalniški del. Brez dostopa do izolirane naprave poročamo NOT RUN, ne PASS.

## 8. Redni zagoni, alarmi, obnovitev

Izbrana predvidena pot: Vercel Schedules samo novega projekta, Preview veja, POST /api/contact/drain. Najprej potrdimo ceno, podporo glavi Authorization in dostop skozi Deployment Protection po uradni dokumentaciji. Če zasebno varnega klica ni mogoče nastaviti brez spremembe kode, pripravimo testni adapter in CI; ne odpremo javno zaščitenega projekta za obvoz.

Interval pet minut (288/dan), čas UTC; upoštevamo dejanski jitter ponudnika. Največ deset minut brez uspešnega zagona sproži neodvisni alarm, tudi če ni novih oddaj. Vsak odgovor 503, pending starejši od deset minut in reconciliation > 0 zahteva alarm. Obstoječi odgovor delavca nima starosti čakalne vrste ali heartbeat zapisa: pred tem dokazom je potrebna dopolnitev samo testne kode/nadzora. Alarm ne sme biti odvisen samo od Resenda, katerega izpad testiramo; lastnik izbere in potrdi ločen kanal ter njegov morebitni strošek.

Dokaz: tri zaporedne uspešne izvedbe; začasno onemogočeno testno razporejanje sproži alarm; neuspešen testni Resend sproži alarm; obnovitev dostavi vse oddaje natanko enkrat; naslednji zagon nič novih pošiljanj. Po 23 urah od prvega poskusa avtomatska ponovitev obstane za ročno primerjavo z Resend dnevnikom. To ni samodejno rešljiva oddaja brez časovne omejitve.

## 9. Dnevni števec — še odprta programska blokada

Aktualna trajna pot NE posodablja starega dnevnega števca v kontaktni bazi. Zelen CI ne dokazuje te funkcije. Pred testom je treba implementirati ločeno, ponovljivo projekcijo iz potrjenih receipt zapisov v NOVO kontaktno bazo, brez odvisnosti sprejema od baze.

Predlagana definicija: enkrat na unikatni intent/receipt, po dnevu prvega trajnega sprejema v Europe/Ljubljana, storitev iz izvornega intenta; samo prejemi s potrditvijo Resenda. Queued brez potrditve = 0 potrjenih, ločeno prikazanih kot čakajoči. Če poslovno pravilo zahteva dan dostave namesto dan sprejema, to potrdimo pred implementacijo. Datum se ne sme vzeti iz ure brskalnika.

Sprejemni test: 3 sintetične oddaje istega dne, 2 potrjeni in 1 queued → potrjeni števec 2; ponovitev delavca ostane 2; dostava tretje → 3; večkratna sinhronizacija ostane 3. Izpad baze med dostavo ne prepreči prejema; po obnovi se števec dopolni brez podvajanja. Preizkus čez polnoč in oba premika poletnega časa. Odgovor nepooblaščenemu uporabniku ne razkrije števca ali osebnih podatkov. Stari produkcijski števec in njegova baza ostaneta nespremenjena.

## Lastnikovi nujni koraki pred storitvami

- Potrdi stroškovni scenarij Vercela in dovoljen mesečni prag; nakupa paketa ne izvedemo brez njega.
- Prijavi se v Vercel/Neon/Resend, kjer je potrebno; gesla in kode niso za klepet.
- Potrdi testnega pošiljatelja, dejanski testni predal ter neodvisni alarmni kanal. Morebitne nove plačljive predale/domeno ponudimo posebej.
- Potrdi uporabo samo nove testne licence/naprave in ločenega Google merilnega cilja, če želiš stvaren pozitivni dogodek.

Šele nato agent ustvari odobrene izolirane vire, pokaže pregled pred prvim Preview deployem, dokonča manjkajoči števec/nadzor, ponovi celoten CI in izvrši stvarne teste. Noben merge ali produkcijska objava. GO šele po dokazih na istem kandidatu, ne zgolj po pripravi navodil.

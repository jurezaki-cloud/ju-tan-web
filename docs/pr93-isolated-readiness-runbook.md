# PR #93 — izolirano okolje, navodila in sprejemni preizkusi

Stanje: kandidat, ne dovoljenje za produkcijo. Noben korak v tem dokumentu ni bil izveden na obstoječi bazi, licenci ali produkciji. Veja: `fix/pr93-readiness-security-test`, izpeljana iz glave PR #93. Brez merge. Skrivnosti se vnašajo izključno v nastavitve ponudnika, nikoli v GitHub, klepet ali posnetke zaslona.

## 1. Kaj je bilo dejansko preverjeno v Vercelu (27. 11. 2026)

V prijavljenem projektu ju-tan-web je produkcija prikazovala objavo z 19. novembra. Seznam Environment Variables ni prikazoval CONTACT_DATABASE_URL, RESEND_API_KEY, EMAIL_FROM ali FROM_EMAIL. Obstoječi Neon/Office podatkovni podatki so dodeljeni tudi Preview. Prebrane so bile oznake in obsegi, ne vrednosti skrivnosti; nič ni bilo spremenjeno. To ni dokaz, da je drug projekt ali zunanje okolje konfigurirano enako.

**Zato ne uporabljaj obstoječega Preview projekta za licenčne ali podatkovne teste.** Ustvari ločen projekt brez kopiranja njegovih nastavitev. Ne pritiskaj Redeploy/Promote v obstoječem projektu.

## 2. Neon — namenski kontaktni projekt (samo po odobritvi)

1. Odpri https://console.neon.tech in izberi New project, ne obstoječega Office projekta.
2. Ime: `ju-tan-contact-pr93-test`; izberi evropsko regijo blizu testnega Vercela. Ustvari prazno bazo `ju_tan_contact_pr93_test` in ločeno vlogo `contact_pr93_test`.
3. V Connect izberi točno ta projekt, vejo, bazo in vlogo. Kopiraj pooled PostgreSQL connection string s SSL. Ne uporabljaj Office povezave, kopije produkcijskih podatkov ali obstoječe podatkovne veje.
4. Po odobritvi samo v SQL Editorju NOVO USTVARJENE baze izvedi `scripts/sql/contact-idempotency.sql`. Pred Run še enkrat primerjaj ime projekta in baze. Ta naloga migracije ni izvedla.
5. V novem testnem projektu Vercel dodaj strežniško spremenljivko `CONTACT_DATABASE_URL`; ne uporabljaj predpone NEXT_PUBLIC. Ime baze mora vsebovati `contact` in se razlikovati od Office baze. Koda nikoli ne uporablja DATABASE_URL kot nadomestila.
6. Za preizkus izpada spremeni samo testno CONTACT_DATABASE_URL na nedosegljiv cilj ali jo izpusti. Nikoli ne ustavljaj obstoječega Neon/Office strežnika.

Pri novem trajnem načinu CONTACT_DURABLE_INBOX=1 baza ni pogoj za sprejem ali pošiljanje. Stara pot in njeni števec/deduplikacija ostaneta na voljo za primerjavo; trajni način ne zapiše samodejno starega dnevnega števca. Pregled potrjenih prejemov temelji na šifriranih receipt zapisih. Ta razlika mora biti sprejeta pred GO.

Neon vir: https://neon.com/docs/connect/connect-from-any-app

## 3. Vercel — ločen projekt in zasebni predal

1. V https://vercel.com/new izberi isti repozitorij, vendar NOV projekt `ju-tan-pr93-sandbox`. Ne kopiraj Environment Variables, domen, baz, Blob shrambe ali licenčnih skrivnosti starega projekta. Pred prvo gradnjo preveri, da se ne objavlja main in da cilj ni Production starega projekta.
2. Uporabi samo vejo `fix/pr93-readiness-security-test`. Brez lastne domene; zaščiten testni naslov. Testna objava potrebuje ločeno odobritev, v tej nalogi ni bila sprožena.
3. V Storage novega projekta ustvari nov Blob store z access **Private**, ime `ju-tan-contact-pr93-test`. Ne poveži obstoječe Office/backup shrambe.
4. Token tega novega store shrani kot `CONTACT_INBOX_BLOB_TOKEN`. Če povezava samodejno doda BLOB_READ_WRITE_TOKEN, ga ne uporabljaj za Office; kontaktni adapter namenoma zavrne enako vrednost v obeh spremenljivkah. V sandboxu odstrani samo samodejno dodano generično spremenljivko oziroma uporabi ročno nastavljeno namensko ime; produkcijskih spremenljivk ne spreminjaj.
5. Lokalno ustvari 32 naključnih bajtov kot 64 hex znakov (`openssl rand -hex 32`). Shrani v `CONTACT_INBOX_ENCRYPTION_KEY` in v upravljalnik skrivnosti. Ne rotiraj ali izgubi ključa, dokler obstajajo šifrirana povpraševanja. Ločen nov testni ključ, ne Office ključ.
6. Drug neodvisen močan naključen niz shrani v `CONTACT_WORKER_SECRET` (najmanj 32 znakov). Nastavi `CONTACT_DURABLE_INBOX=1` in CONTACT_EMAIL_TO po spodnjem Resend koraku.
7. Razporejevalnik zunaj kode mora vsakih pet minut poslati POST na testni `/api/contact/drain` z Authorization: Bearer in CONTACT_WORKER_SECRET. Ne dodajaj ali spreminjaj obstoječega licenčnega cron opravila. Preveri uspešen klic brez osebnih podatkov v dnevniku; vsak 503 zahteva opozorilo odgovorni osebi. V tej nalogi razporejevalnik NI ustvarjen.
8. Alarm: neuspešen delavec ali pending dlje od 10 minut; vsako `reconciliation > 0` takoj v ročni pregled. Pred 23 urami od prvega poskusa primerjaj Resend dnevnik in receipt. Po 23 urah koda ne pošilja slepo znova. Resend deduplikacija velja 24 ur.
9. Pred uporabo resničnih podatkov odobri čas hrambe, dostop in postopek izbrisa. Koda ne briše povpraševanj ali tombstone zapisov. Začetni sprejem je zaščiten z obstoječo omejitvijo poskusov, ki ni porazdeljena kvota; preveri WAF in kvoto shrambe pred javnim GO.

Trajnost: uspešen odgovor šele po potrjenem zasebnem, aplikacijsko šifriranem AES-256-GCM zapisu. Isti ključ ustvari isti objekt brez overwrite; drugačna vsebina ni nova oddaja. Status in preklic tekmujeta na istem atomarnem objektu. Ponovno pošiljanje uporablja isti Resend idempotency key in nespremenjeno vsebino/routing. Ob nedosegljivi shrambi NI lažnega uspeha. Noben sistem ne zagotavlja sprejema ob hkratnem izpadu vseh neodvisnih trajnih shramb.

Vercel vir: https://vercel.com/docs/vercel-blob/using-blob-sdk

## 4. Resend — testno pošiljanje, ne produkcijski inbox

1. Prijavi se na https://resend.com, odpri Domains. Preveri že potrjeno domeno; ne spreminjaj DNS, MX ali produkcijske domene v tem opravilu. Če ni primernega potrjenega pošiljatelja, je to odprt korak za lastnika domene.
2. API Keys → Create API Key, ime `ju-tan-pr93-sandbox`, dovoljenje Sending access, omejeno na izbrano potrjeno domeno. Skrivnost kopiraj samo v novi testni projekt kot RESEND_API_KEY.
3. EMAIL_FROM nastavi na pošiljatelja na tej potrjeni domeni (točen naslov potrdi lastnik). Ne nastavljaj še FROM_EMAIL; oboje ni potrebno.
4. CONTACT_EMAIL_TO naj bo `delivered@resend.dev` za prvi tehnični preizkus. To je Resendov testni cilj, ne dokaz prejema v resničnem predalu.
5. Za dejanski prejem lastnik posebej odobri testni e-poštni predal; potem ga nastavi samo v sandboxu in uporabi nov predal/novo testno shrambo ali nove oddaje. Zaradi zaščite pred spremembo prejemnika obstoječih intent zapisov se routinga ne spreminja med ponovitvami.
6. Oddaj sintetično povpraševanje. Primerjaj ID v odgovoru, šifrirani receipt in Resend dnevnik. Accepted pomeni ponudnik je sprejel, Delivered pomeni dostava; oboje preveri ločeno. Nikoli ne uporabi podatkov dejanske stranke.
7. Izpad simuliraj samo z neveljavnim testnim ključem. Pričakuj 202/queued, ohranjen intent, brez conversionId in brez oglasne konverzije. Obnovi isti testni ključ in kliči zaščitenega delavca; pričakuj en prejem ter brez ponovitve ob naslednjem klicu.

Viri: https://resend.com/docs/dashboard/emails/idempotency-keys ; https://resend.com/docs/dashboard/emails/send-test-emails ; https://resend.com/docs/dashboard/api-keys/introduction

## 5. Testni načrt: dva obrazca × štiri kombinacije

Obrazca: /kontakt in Vodič storitev → Želim ponudbo. Za vsako kombinacijo odpri nov profil brskalnika. Obvezna privolitev v obdelavo kontaktnih podatkov ni ista kot neobvezno merjenje.

| Analitika | Oglasi | Pričakovani rezultat potrjene oddaje |
|---|---|---|
| ne | ne | Oddaja uspe; brez oglasne konverzije in brez analitičnega merjenja |
| da | ne | Oddaja uspe; analitika samo po soglasju, brez Google Ads konverzije |
| ne | da | Oddaja uspe; natanko ena dovoljena Google Ads konverzija, brez analitike |
| da | da | Oddaja uspe; natanko ena dovoljena konverzija in dovoljeno analitično merjenje |

Za vseh osem primerov ponovi: uspeh s potrjenim Resend ID, queued odgovor brez ID, 400, 429, 503, omrežni timeout, dvojni klik, refresh, izrecni recovery, preklic, sprememba soglasja po oddaji in ponovni klik. Queued vedno pomeni nič konverzij tudi če so oglasi dovoljeni. Naknadna dostava delavca ne pošilja retrospektivnih konverzij in ne shranjuje oglasnega soglasja/identifikatorjev. Vpis brez obvezne kontaktne privolitve mora biti blokiran.

Google Tag Assistant: https://tagassistant.google.com → Add domain samo ODOBREN testni naslov. Trenutna koda pravilno blokira Google Ads na Vercel Preview. Ne odstranjuj te varovalke in ne pošiljaj testnih konverzij v obstoječo produkcijsko akcijo. Na Preview je pričakovan nič oglasnih zahtev; lokalni CI uporablja prestrežene Google zahteve in testno stikalo. Za celovit pravi Tag Assistant dogodek je potreben posebej odobren testni merilni cilj/izoliran origin. Tega v tej nalogi nismo ustvarili in brez njega dokaz ni opravljen. Lokalni testi niso nadomestilo za ta dokaz.

Dokazi: testni naslov in različica; čas; izbrano soglasje; anonimiziran screenshot; API rezultat; Resend ID/stanje; število dogodkov brez vsebine obrazca; SHA CI rezultata. Nikoli ne shranjuj ključev, e-poštnih naslovov resničnih strank ali vsebine kontakta v javni repozitorij.

## 6. JU-TAN Office — varen načrt s testno licenco

Pripravljen načrt, NE izvršena aktivacija. Obstoječa baza, licenca in licenčna koda ostanejo nespremenjene.

1. Lastnik izroči že obstoječo, samo testnemu okolju namenjeno licenco ali odobri ustvarjanje nove izključno v novi prazni Office testni bazi. Ne kopiraj produkcijske baze ali licence. Brez te potrditve STOP.
2. Uporabi nov projekt in ločene testne DATABASE_URL, podpisne skrivnosti, prenosno geslo in zasebno testno datoteko. Ne uvozi produkcijskih Vercel spremenljivk. Ne uporabljaj contact baze za Office.
3. Pred odpiranjem Office odobritelj potrdi imena gostiteljev in baz ter testno identiteto; shrani le redigiran kontrolni seznam. Blokiraj dostop do produkcijskih gostiteljev na testni napravi, kjer je izvedljivo.
4. Preveri zavrnitev prenosa brez prijave; napačno testno geslo; veljavno testno sejo; napačno/izteklo licenco z vnaprej pripravljenimi fixture primeri; veljavno testno licenco; odjavo in potek seje. Ne spreminjaj omejitev, stanja ali datuma nobene licence zaradi testa.
5. Če aktivacija zapiše napravo ali porabi mesto, jo izvedi samo na odobreni testni licenci in testni napravi. Brez ustrezne izolacije STOP, ne preizkušaj na produkciji.
6. Pred in po testu primerjaj samo testno okolje in preveri, da kontaktni izpad baze ne vpliva na Office ter obratno. Produkcije ne kliči za dokaz nespremenjenosti; dokazujemo nespremenjenost licenčnih datotek z diffom.
7. Zabeleži odobritelja, testno okolje, zadnje neobčutljive znake testne licence, izid vsakega koraka in dokaz brez skrivnosti. Nobena aktivacija v tej nalogi ni bila izvedena.

## 7. Stroga vrata GO

- Ni npm audit opozoril na istem kandidatu; zeleni lint, tipi, build, P0, hardening, Free Lab, SEO, magic, inventar in podatkovna izolacija.
- Vseh 42 prvotnih brskalniških testov je ohranjenih; dodatnih 8 preveri queued oddaje/soglasja; enotski testi preverijo izpade in deduplikacijo.
- Potrjena neodvisna Private Blob shramba, šifrirni ključ, scheduler/alarms in postopek hrambe; stvarni preizkus izpada kontaktne baze ter dostave po obnovi.
- Potrjena Resend domena, samo testni ključ in prejemnik; dokaz Accepted in Delivered za oba obrazca.
- Dokaz izrecno dovoljenega Tag Assistant testa brez onesnaženja produkcijskih konverzij.
- Office preizkus z odobreno testno licenco v ločenem okolju.
- Vse to mora biti preneseno v kandidat PR #93 šele po pregledu; ta veja sama ne spremeni PR #93 in ni merge.

Če manjka kateri koli zunanji dokaz, rezultat ostane NO-GO, tudi ob vseh zelenih avtomatskih testih. Razveljavitev: brez preklopa produkcije ni potrebna; testne nastavitve onemogoči samo v sandboxu, ohrani intent/receipt za pregled in ne briši shrambe z neobdelanimi zahtevami.

# JU-TAN P0 – izvorna koda, varnost in način preverjanja

## Obseg

Veja: `fix/google-ads-conversion-tracking-p0`. Osnova: `main` z dne 19. 11. 2026. Brez merge, objave v produkcijo, sprememb Google Ads ali resničnih oddaj. Končna odločitev je NO-GO do zaključenih preverjanj in lastnikove odobritve.

Identifikatorji ostanejo nespremenjeni: AW-18531808239 / YQbkCOaJz7gdEO_n04RF. Dejanje 7903364326 je nastavitev Google Ads in ni parameter, ki bi nadomestil Conversion ID.

## Potrjeno v osnovi

- `components/ai/LeadForm.tsx` po `response.ok` ni bral JSON, preveril `success:true`, poklical `trackContactConversion` ali uporabljal sinhronega zaklepa `useRef`.
- Glavni `components/contact/ContactForm.tsx` že preverja uspeh in uporablja zaklep; oba obrazca sta bila neposredna odjemalca `/api/contact`.
- `lib/google-ads.ts` v `onerror` ni ponastavil začetega nalaganja, izpraznil je čakajoče, ID pa je ostal v `seen`. Ponoven poskus ni bil izvedljiv.
- `/api/contact` uporablja Resend, potrdi `result.data.id` in vrne ta ID kot `conversionId`. Sprejem pri ponudniku ni dokaz dostave v nabiralnik. Ni uporabljal ponudnikovega idempotency ključa.
- Oglasno soglasje je ločeno od analitike; ohranjena sta isti ključ in osnovni Consent Mode. Ni dodatnega GTM ali nove konverzije.

## Spremembe

- Oba obrazca uporabljata `sendContactRequest` in `readContactSuccess`. `success:true` brez ID ostaja neizmerjen navidezni uspeh zaradi obstoječe zaščite honeypot; ni Google Ads konverzija.
- Vodič sproži obstoječi adapter šele po potrditvi odgovora in ima sinhroni zaklep. Glavni obrazec ohrani obliko, polja in obstoječo analitiko.
- Nespremenjeni normalizirani podatki ponovijo isti neosebni ključ in enako telo. Po omrežni napaki se ključ ne ponastavi. Druga vsebina se šteje za nov namen.
- Strežnik validira ključ in ga posreduje Resend kot `idempotencyKey`. Čas v telesu e-pošte je determinističen za isti ključ. Resend po uradni dokumentaciji hrani idempotency ključe 24 ur; aplikacija dovoljuje 23-urno okno. ID uspeha je ponudnikov ID, uporabljen kot `transaction_id`.
- Oglasni adapter loči čakajoče in že postavljene dogodke. Odstrani neuspešno skripto; ponovni poskus se izvede le ob eksplicitnem sync/novem potrjenem odgovoru, z 1-sekundnim presledkom in največ 2 naložitvama na dokument. Ni samodejnega neskončnega retry.
- Preklic soglasja izprazni čakajoče; kasnejša privolitev ne predvaja preteklih zavrnjenih oddaj. ID je označen kot postavljen šele po klicu `gtag`.
- Produkcijska oznaka deluje samo na ju-tan.com/www.ju-tan.com in s `NEXT_PUBLIC_VERCEL_ENV=production`. Preview in neznana okolja so privzeto blokirana. Lokalni CI ima izrecni flag in prestreže Google promet.

## Testiranje

Namestitev: `npm ci` z obstoječim zaklepom odvisnosti; ni novih paketov. CI na tej veji izvaja lint, ločen lint spremenjenih datotek, typecheck, build, vse obstoječe npm testne ukaze, dodatni magic test, P0 teste in brskalniške teste. Inventar poišče vse datoteke `.test.*`; dve izvozljivi varnostni zbirki pokliče izrecno.

Novi testi vključujejo glavni obrazec in vodič, potrjen/nepotrjen odgovor, pokvarjen JSON, napako HTTP, manjkajoč ID, dvojno oddajo, retry istega telesa/ključa, nov namen, potek ključa, odobritev/preklic soglasja, neuspešno nalaganje in zastarel onload, pravilni transaction_id in blokado Preview. Google in e-poštni ponudnik sta nadomeščena; brskalnik deluje samo proti lokalnemu strežniku.

Rezultate zadnje različice preverite v `.github/workflows/google-ads-p0.yml` / GitHub Actions; stanje starejšega izvajanja ni dokaz za novejšo različico. Poln lint je že pred posegi v ostale datoteke pokazal 5 obstoječih napak v Marko, FadeIn, HeroStageDeferred in OfficeProductStageDeferred. Te datoteke in pravila niso spremenjeni.

## Zgodovina okoli 18. novembra

Na dosegljivi zgodovini `main` ni commita 18. 11. Google Ads adapter in kontaktna strežniška pot sta bila nazadnje spremenjena 15. 11. z #84. 17. in 19. 11. sledijo spremembe ciljnih strani ter optimizacije; sama časovna bližina ni dokaz izpada merjenja. GitHub beleži uspešno produkcijsko objavo osnove 19. 11.; to ni vpogled v Vercel/Resend dnevnike.

## Meje in tveganja – ne prikrivati

- Ni dokazano, da so pingi nehali zaradi ene od teh vrzeli; zadnji ping 18. 11. je uporabnikov podatek. Dejanskega prejema konverzije ni bilo dovoljeno preizkusiti.
- Idempotentnost je omejena na isti ključ/telo znotraj okna ponudnika. Predhodno odprte stare strani brez glave so zaradi združljivosti še sprejete brez zagotovila retry. Osvežitev/remount ali ročno ponovno vneseno povpraševanje lahko ustvari nov ključ. Za trajno preprečevanje ponovitev prek naprav/zavihkov je potreben dodaten strežniški dnevnik/hranjenje; tega ni mogoče obljubiti iz trenutne izvedbe.
- Ključ uporablja uro odjemalca; čas več kot minuto v prihodnosti se zavrne. Pred odobritvijo produkcije preveriti vpliv napačne ure odjemalca in po potrebi dogovoriti strežniško izdajo ključa.
- Obstoječi agregatni števec `recordConfirmedInquiry` se izvede tudi ob ponovljenem uspehu ponudnika in lahko preceni interno statistiko. Ne določa Google Ads dogodka; za njegovo deduplikacijo je potrebna ločena sprememba podatkovne plasti. Ni uvedena tiha migracija baze.
- `seen` varuje isti dokument, Google deduplicira isti transaction_id. Postavitev v vrsto ni potrdilo prejema pri Googlu. Zaprt zavihek, blokator ali zavrnjeno soglasje lahko prepreči meritev.
- Nobeno novo beleženje osebnih podatkov. Obstoječi vodič že shranjuje svoj povzetek v lokalno zgodovino; ta ločena funkcija ni spremenjena.
- Preview privzeto blokira Google, ne pa nujno pošiljanja e-pošte, če so tam že nastavljene produkcijske skrivnosti. Vseh testnih oddaj na resničnem okolju ni dovoljeno izvajati brez odobritve.

## Ročno preverjanje – samo po odobritvi

1. Pregled izvornih sprememb in vsi zahtevani CI koraki. Obstoječe napake lint naj lastnik odpravi ali izrecno sprejme kot ločeno znano blokado; pravil ne izklapljamo.
2. Na odobrenem testnem okolju preveriti Consent default/update v Tag Assistant; pred soglasjem in po preklicu 0 novih konverzij. Preveriti vsako od 4 stanj.
3. Po eni posebej odobreni oddaji prek obeh obrazcev: potrjen sprejem pri Resend, isti conversionId/transaction_id, 1 logični dogodek; po refresh ali dvojnem kliku 0 dodatnih. Napaka, click brez oddaje in zavrnitev soglasja ostanejo 0.
4. Preveriti neposredni/preusmerjeni prihod na kontakt in Vercel produkcijske okoljske vrednosti. Nobenega klika lastnega oglasa. Nepripisan testni dogodek ni nujno viden kot konverzija Google Ads.
5. Izrecna odobritev merge in produkcijske objave; do tedaj NO-GO. Povratek: povrnitev tega izoliranega popravka/objave po odobritvi; brez spremembe identifikatorjev.

Viri: https://resend.com/docs/dashboard/emails/idempotency-keys ; https://vercel.com/docs/environment-variables/framework-environment-variables ; https://developers.google.com/tag-platform/security/guides/consent-debugging

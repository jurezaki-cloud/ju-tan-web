# P0 — trenutno izvajanje popravkov in testna konfiguracija

Ta zapis dopolnjuje starejše NO-GO preglede; nič od spodnjega ni dovoljenje za produkcijsko spremembo. Vrednosti skrivnosti niso v repozitoriju ali poročilih.

## Zahtevane nastavitve v Vercelu

Projekt JU-TAN Studio / ju-tan-web → Settings → Environment Variables. Zadnji bralni pregled 27. 11. ni našel CONTACT_DATABASE_URL, RESEND_API_KEY ali EMAIL_FROM/FROM_EMAIL; preverba ni pomenila pregleda vrednosti zgodovinskega deploymenta.

Najprej ločeno, posebej odobreno testno okolje:
- CONTACT_DATABASE_URL: namenska PostgreSQL povezava, brez fallback na Office. Ločena baza ali infrastruktura in omejena vloga samo za kontaktni tabeli. TLS verify-full; zasebni CA potrebuje izrecen pregled, ne rejectUnauthorized:false. Pred uporabo odobrena migracija v testni bazi. Runtime pravice SELECT/INSERT/UPDATE, brez DDL; migracijska vloga ločena.
- RESEND_API_KEY: namenski omejeni ključ za testni račun/domeno, ne produkcijski ključ v CI.
- EMAIL_FROM: preverjeni pošiljatelj oblike JU-TAN Studio <ime@preverjena-domena>; FROM_EMAIL le obstoječi fallback, ne dve nasprotujoči nastavitvi.
- NEXT_PUBLIC_VERCEL_ENV: uporabi sistemsko spremenljivko Vercel, brez ročnega nastavljanja Preview v production ali obratno. NEXT_PUBLIC_GOOGLE_ADS_LOCAL_TEST ne omogočaj na Vercelu; velja samo za izoliran localhost.
- Production in Preview ne smeta deliti testnih baz, dostopa do Office ali nenamerno pošiljati resničnim strankam. Trenutna koda pošilja na info@ju-tan.com, zato tudi Preview z veljavnimi Resend skrivnostmi NI dovoljen za testne oddaje brez izrecne odobritve.

Ne pošiljaj skrivnosti v chat, ne uporabljaj NEXT_PUBLIC za bazo/Resend in ne izvozi .env v CI artefakte. Nastavitve vnesi šele po odobritvi okolja, nato je ločeno odobren build/deploy potreben, da začnejo veljati. V tej nalogi ni nastavitev, migracij ali deploya.

## Recovery pogodba

POST /api/contact/status sprejme samo neuganljiv Idempotency-Key v glavi, nikoli token v URL. No-store, preverba Origin, rate limit, nobenega kontakta ali vsebine v odgovoru. Statusi:
- accepted: receipt je trajno zapisan. Obnova UI ne pošlje nove pošte in NE ustvari naknadne Google konverzije z morda drugačnim soglasjem.
- cancelled: nevideni ključ se atomsko spremeni v tombstone. Pozno prispeli prvotni POST je zavrnjen; izrecna nova oddaja lahko dobi nov ključ.
- pending: original je že rezerviral ključ, vendar receipt ni potrjen. Brez avtomatskega novega ključa ali pošte; potreben isti odprti poskus ali ročna uskladitev pri ponudniku.
- unavailable: ne briši markerja in ne ustvari novega ključa; stik po e-pošti/telefonu ostaja varen izhod.

Web Locks serializirajo pošiljanje na istem originu; brez podpore ni tihega fallback. Brisanje storage, druga naprava ali nova zavestna oddaja niso isti ključ. To ni semantično združevanje vseh prihodnjih povpraševanj. Še vedno ne obljubljamo trajnega sprejema med izpadom PostgreSQL ali samodejne obnovitve vsebine obrazca; za to je potrebna neodvisna trajna vrsta in odobrena obdelava osebnih podatkov. Stanja pending po neznanem ponudnikovem sprejemu čez 24h se nikoli ne pošljejo slepo znova.

## Migracija in rollback

Preflight sheme in omejenih pravic, kopija/obnova v testu, nato izrecna odobritev za produkcijo. Pregledana SQL skripta dodaja cancelled in receipt_id brez osebnih vsebin. Predlog transakcije: SET LOCAL lock_timeout='2s'; SET LOCAL statement_timeout='10s'; nato skripta in preverjanje omejitev. CREATE IF NOT EXISTS ni validacija že obstoječe napačne sheme; ob neskladju ustavi.

Povrnitev kode ne izbriše tabel ali tombstones. Noben DROP/TRUNCATE in nobena obnova celotne Office baze. Povratni kandidat mora razumeti veljavne ključe in novo pogodbo, sicer začasno zapri nepreverjeno pot oddaje z jasnim stikom po e-pošti brez lažne potrditve. Če je provider outcome dvoumen, najprej uskladitev, ne nov send. Office sheme/spremenljivke/ključi ostanejo nedotaknjeni.

## Varnostne odvisnosti

Ne izvajamo audit fix --force ali prepisov glavnih verzij na slepo. Vseh 14 moderate vnosov, izvorni glob/minimatch opozorili, poti in omejitve dosegljivosti so posamično navedeni v docs/p0-vercel-release-findings.md. Paketi zaenkrat niso spremenjeni; preostala tveganja niso razglašena za odpravljena. Registry audit se ponovi na zadnjem kandidatu. Posodobitve potrebujejo ločeno preverjene peer zahteve in regresije, ne ukaza, ki prikrije rezultat.

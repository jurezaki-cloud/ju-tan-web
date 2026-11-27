# JU-TAN P0 – izvorna koda, varnost in preverjanje

## Obseg in odločitev

Veja `fix/google-ads-conversion-tracking-p0`; predlog #93 ostane osnutek. Brez merge, produkcijskega deploya, realnih testnih oddaj in sprememb Google Ads. **NO-GO** do pregleda migracije, delujočega podatkovnega okolja in posebej odobrenih end-to-end preverjanj. Rezultati starejšega kandidata niso rezultati novega: sledite GitHub Actions za točno trenutno različico.

Pravilni identifikatorji ostajajo AW-18531808239 / YQbkCOaJz7gdEO_n04RF. Obstoječe dejanje Google Ads je 7903364326. Ni nove konverzije, dodatnega GTM, dizajnskih ali SEO sprememb.

## Potrjeno v osnovi main

- Vodič `components/ai/LeadForm.tsx` po HTTP uspehu ni bral JSON, preverjal success:true, meril konverzije ali sinhrono zaklepal dvojne oddaje.
- Glavni `components/contact/ContactForm.tsx` je preverjanje uspeha in zaklep že imel.
- `lib/google-ads.ts` je ob onerror počistil čakajoče, pustil initialized in seen ter onemogočil obnovitev nalaganja.
- `/api/contact` uporablja Resend; success:true in conversionId nastaneta šele po ponudnikovem ID. To potrdi sprejem, ne dostave v nabiralnik. Idempotency ključa pred popravkom ni bilo.
- Osnovni Consent Mode in ločeno prostovoljno oglasno soglasje sta že obstajala.

## Skupna obdelava obrazcev

Oba obrazca uporabljata `sendContactRequest` in `readContactSuccess`. Neuspešen HTTP, neveljaven JSON in success:false niso uspeh. Obstoječi honeypot vrne navidezni success:true brez ID: nikoli se ne meri. Manjkajoč/prazen conversionId tudi sicer ne sproži Google Ads.

Vodič po potrditvi kliče isti adapter in ima sinhroni zaklep useRef. Ključ in točno telo se ohranita pri ponovitvi istega zahtevka v istem nameščenem obrazcu. Druga vsebina pomeni nov namen in nov ključ. Ključ ni izpeljan iz osebnih podatkov. Vztrajnega brskalniškega shranjevanja vsebine ali njenih hashov nismo dodali.

## Trajni strežniški ključ in enkratno štetje

Dodana sta `lib/contact-ledger.ts` in **neizvedena** migracija `scripts/sql/contact-idempotency.sql`.

- `contact_delivery_attempts` hrani samo naključni ključ, čas prvega prejema na strežniku in zastavico counted. Nobene vsebine obrazca, kontakta, IP, prstnega odtisa ali Googlovega profila.
- Unikatna vrstica se ob ponovitvi ne pomladi. Čas prejema za isto e-poštno telo je stabilen prek različnih procesov. Ura odjemalca se ne uporablja za strežniško veljavnost.
- Strežnik preda isti ključ in telo Resend. Resend po uradni dokumentaciji 24 ur vrača isti odgovor za isti ključ/telo; aplikacija po 23 urah strežniškega časa zahtevek zavrne, namesto da bi tvegala novo dostavo. Isti ID ponudnika postane transaction_id.
- Isti ključ z drugim telesom Resend zavrne; aplikacija ne zamenja ključa in ne vrne lažnega uspeha.
- CTE v eni atomski SQL izjavi označi counted in poveča dnevni števec samo prvič. Sočasne ponovitve istega ključa ne povečajo števca večkrat. Datum agregata izhaja iz prvega prejema v Europe/Ljubljana.
- Če števec po ponudnikovem sprejemu odpove, odgovor ostane uspeh in ne sproži nove pošte. Kasnejša varna ponovitev lahko števec dopolni; brez ponovitve lahko ostane podštet. Starih precenjenih zgodovinskih podatkov nismo popravljali.
- Manjkajoča glava je zdaj zavrnjena. Stare že odprte strani morajo po objavi ponovno naložiti novo kodo. Ni naključnega fallback ključa.
- Če baza ali shema pred pošiljanjem ni dosegljiva, oddaja vrne 503 in ne kliče ponudnika. **To je nova kritična produkcijska odvisnost, ne neopazna izboljšava.**

### Pomembna meja garancije

Jamstvo se nanaša na isti logični ključ, ne na semantično podobna sporočila z novimi ključi. Refresh/remount, druga naprava, nov zavihek ali ročni ponovni vnos lahko ustvarijo nov ključ. Tega ne prikrivamo kot odpravljeno: za nadaljevanje istega namena čez refresh bi potrebovali pregledano obnovitev neosebnega tokena in izrecno obravnavo novega namena, ne shranjevanja osebnih podatkov. Blokator, odhod s strani ali zavrnitev soglasja lahko prepreči zajem Google dogodka.

## Migracija in objava: samo po odobritvi

1. Lastnik naj odobri shemo in izbrano **testno** bazo; ne uporabljati produkcijskih podatkov za CI.
2. Skrbnik na odobrenem okolju izvede `scripts/sql/contact-idempotency.sql`; aplikacija ne izvaja te migracije pri zahtevku ali build. Produkcijske migracije v tej nalogi nismo izvedli.
3. Preveriti pravice INSERT/UPDATE/SELECT na novi tabeli in obstoječem agregatu ter povezavo, ki jo uporablja `licensingPool`. Ta trenutno zahteva LICENSING_DATABASE_URL (ali DATABASE_URL), JU_TAN_LICENSE_TOKEN_SECRET in JU_TAN_LICENSE_KEY_PEPPER. Ne razkrivati skrivnosti.
4. Expired vrstice so trajni tombstones: samodejno jih ne brisati. Brisanje bi znova dovolilo star ključ po izteku ponudnikove zaščite. Dogovoriti arhiviranje, spremljanje rasti in operativno politiko, preden gre v produkcijo.
5. Preveriti, da NEXT_PUBLIC_VERCEL_ENV obstaja pri produkcijskem build. Preview in neznane domene so za Google blokirane; ni treba omogočiti produkcijskih konverzij za CI.
6. Po odobritvi end-to-end testa preveriti glavni obrazec in vodič, dostavo/prejem pri ponudniku in Tag Assistant. Šele nato ločena odobritev merge/deploy. Do takrat NO-GO.

## Merjenje in soglasje

Ohranjen je ključ ju-tan-ads-v1. Pred privolitvijo se gtag.js ne nalaga. Vsi 4 privzeti parametri so denied; po izrecnem sprejemu sta ad_storage in ad_user_data granted, personalizacija in Google analitika ostaneta denied.

Čakajoči in že postavljeni ID so ločeni. Napaka odstrani skripto in omogoči naslednji eksplicitni sync/nov potrjen odgovor po vsaj 1 sekundi; največ 2 poskusa na dokument. Zastarel onload ne odpošlje vrste. Preklic izbriše čakajoče, ponoven sprejem ne predvaja zavrnjenih oddaj. Postavitev v gtag vrsto NI potrdilo prejema pri Googlu.

Google deluje samo na produkcijskem ju-tan.com/www.ju-tan.com. Izrecni lokalni flag velja le za localhost/127.0.0.1 in neprodukcijski način. Preview ne pomeni nujno blokade e-pošte: če bi imel Resend skrivnosti, bi jo lahko pošiljal; zato brez odobritve ni realnih testov.

## Avtomatizirani testi

CI izvaja lint, scoped lint, typecheck, build, obstoječe zbirke hardening/free-lab/SEO/magic, inventar preostalih izvozljivih preverjanj, P0 enotske in brskalniške teste. `test:ads` sedaj potrebuje lokalni PostgreSQL in poteka v izoliranem CI servisu PostgreSQL 17, ne proti Vercel bazi. Test zavrne povezavo, če gostitelj ni localhost in ime baze ni ju_tan_contact_test.

`tests/contact.test.ts` uporablja pravo lokalno SQL izvajanje in nadomestni Resend: enak ID, izgubljen odgovor po sprejemu, 4 sočasni zahtevki, 8 sočasnih povečanj internega števca, nespremenjen server timestamp, potek vrstice, velika odstopanja klientove ure, odsotna glava ter izpad baze pred pošiljanjem. Ne kliče prave e-poštne storitve.

Brskalniški testi preverijo oba obrazca, potrjene in napačne odgovore, dvojni submit, soglasje, refresh po uspehu in ohranitev ključa po omrežni napaki. To ni test vztrajnega tokena po izgubljenem odgovoru IN refreshu; tega ne trdimo. Testi za Google vključujejo retry budget, stale onload, pravilen transaction_id in Preview guard.

Celoten lint ima 5 predhodnih napak zunaj P0; neodvisni baseline jih potrjuje. Pravil ne izklapljamo. Glava strani prekriva gumb za zapiranje vodiča v prejšnjem browser teku; Escape je obstoječa podprta pot, ne popravek prekrivanja. Dizajn je nespremenjen.

## Zgodovina okoli 18. novembra

V pregledani dosegljivi zgodovini main ni commita 18. 11.; osnovni adapter in kontaktna strežniška pot sta od #84 z dne 15. 11. Sledijo spremembe strani 17. in 19. 11. To ne dokazuje vzroka manjkajočega pinga. Vercel/Resend zgodovinski dnevniki in produkcijske skrivnosti niso bili pregledani.

## Tag Assistant, šele po odobritvi

Povežite https://ju-tan.com/kontakt v tagassistant.google.com. Preverite default/update vseh 4 stanj pred privolitvijo, po sprejemu in preklicu. Po posebej odobreni oddaji vsakega obrazca pričakujte success:true, neprazen conversionId in en logični conversion z istim transaction_id. Napačen odgovor, gumb brez uspeha in odsotna privolitev morajo dati 0. Testni obisk brez klika oglasa ni nujno pripisan v Google Ads; lastnega oglasa ne klikati.

Viri: https://resend.com/docs/dashboard/emails/idempotency-keys ; https://developers.google.com/tag-platform/security/guides/consent-debugging ; https://vercel.com/docs/environment-variables/framework-environment-variables

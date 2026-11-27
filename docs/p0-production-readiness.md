# PR #93 — produkcijska vrata (27. 11. 2026)

Ta dokument NADOMEŠČA starejše trditve v google-ads-p0-hardening.md o uporabi licensingPool in neobstoječi blokadi po refreshu. Končni rezultati so vezani na kandidat v PR in povezane CI teke, ne na starejši kandidat. Odločitev ostaja NO-GO. Brez izvedene produkcijske migracije, mergea, deploya, dejanskih testnih oddaj ali sprememb Google Ads.

## Bralni pregled Vercela

Vercel ni na seznamu neposredno razpoložljivih povezav tega delovnega prostora. Ne izmišljamo si connect providerja ali OAuth dovoljenj. Možen je pregled v deljenem brskalniku, po prijavi uporabnika in potrditvi ustreznega projekta.

Zahtevano samo za projekt, ki upravlja ju-tan.com:
- Project Viewer (če ga obstoječi paket omogoča): ogled projekta, domen, zgodovine in metapodatkov deployev ter konfiguracije build/runtime.
- Ogled imen, okoljskih obsegov in prisotnosti spremenljivk; NIKOLI prikaza vrednosti, izvoza .env ali razkritja skrivnosti.
- Bralni ogled omejenih/redigiranih dnevnikov Functions in build. Vercel Pro Viewer po dokumentaciji nima dostopa do logov in nekaterih nastavitev, zato lastnik po potrebi pokaže ta pogled sam ali pripravi redigiran izpis. Ne zahtevamo višjih pisalnih pravic samo za dnevnike.
- NOBEN deploy/promote/rollback, pisanje nastavitev, upravljanje članov, billing, produkcijski token ali dostop do drugih projektov. Ne zahtevamo vabila na izmišljen servisni e-naslov.

Ob prijavi naj se preverijo: povezani Git repozitorij in produkcijska veja; objavljeni kandidat; Node/build ukaz; avtomatske Preview objave; domene; trajanje/regija Functions; obsegi RESEND_API_KEY in EMAIL_FROM/FROM_EMAIL; NEXT_PUBLIC_VERCEL_ENV pri gradnji; CONTACT_DATABASE_URL brez vrednosti; reference do storitve podatkovne baze. Obstoječih LICENSING_DATABASE_URL/DATABASE_URL in licenčnih skrivnosti ne spreminjati. Prisotnost imena ni dokaz pravilne vrednosti ali delujoče povezave.

## Ločitev od JU-TAN Office

`lib/contact-db.ts` ima lastno globalno instanco, največ 2 povezavi na proces, omejeno čakanje in lastno CONTACT_DATABASE_URL. Ne uporablja licensingPool, getLicensingConfig, DATABASE_URL, LICENSING_DATABASE_URL ali licenčnih podpisnih skrivnosti. Office izvorne datoteke ostanejo nespremenjene.

Potrebna je namenska kontaktna DB vloga z dovoljenji samo SELECT/INSERT/UPDATE za contact_delivery_attempts in site_inquiry_daily; brez CREATE/DROP/ALTER ter brez pravic na office_* tabelah. Migracijska vloga je ločena. Če se uporablja isti strežnik kot Office, izoliran pool NE odpravi skupnega CPU/IO/connection limita. Pred uvedbo preveriti globalni connection budget pri več Vercel instancah in uporabiti odobren pooling endpoint. Za najvišjo izolacijo ločena kontaktna baza/storitev; ob tem je treba posebej urediti bralno projekcijo internega števca, ki danes bere stari vir. Ne spreminjati licenčnih tabel ali obstoječega agregata brez preverjanja združljivosti.

Integracijski test nastavi neveljavno licenčno konfiguracijo, izvede kontaktni tok s pravim lokalnim PostgreSQL in preveri, da licenčni pool ni inicializiran. To ni produkcijski test aktivacije/obnove Office: pred GO je potreben odobren izoliran licenčni smoke test s testno licenco, ne resničnimi licencami.

## Izpad baze: kaj danes velja in česa ni

Trenutna implementacija NE sprejme trajno novega povpraševanja ob izpadu baze. Vrne 503 pred klicem Resend. To prepreči tvegano dvojno pošiljanje, ne zagotovi neprekinjenega sprejema. Obstoječi potrjeni ponudnikov sprejem ni isto kot dostava v nabiralnik. Nobenega tihega fallback pošiljanja, zapisovanja na /tmp ali fire-and-forget dela.

Za trajen sprejem tudi ob izpadu PostgreSQL je potreben neodvisen trajni vhod (npr. odobrena upravljana vrsta sporočil), šifriranje vsebine, omejena hramba in dovoljenja ter redakcija logov. Tega nismo priključili, kupili ali razglasili za implementirano. Vercel Queues po dokumentaciji uporablja at-least-once, ne exactly-once. Porabnik mora biti idempotenten:
1. API potrdi accepted/pending šele po potrjenem trajnem enqueue, nikoli success/delivered. Google sedanjega delivery cilja ne sme meriti ob samem enqueue.
2. Worker ob izpadu kontaktne baze ne pošilja pošte; message ostane v vrsti in se z backoff ponovno dostavi. Nobenega klica Office tabel ali poola.
3. Worker uporablja isti stabilni ključ, trajno stanje in ponudnikov receipt. Izgubljeni odgovor po ponudnikovem sprejemu zahteva isti ključ v ponudnikovem 24h oknu; po izteku dvoumnega okna sledi karantena in uskladitev, NIKOLI slepo ponovno pošiljanje. Brez ponudnikove neomejene deduplikacije oziroma uskladitve ni pošteno obljubiti matematičnega exactly-once ob poljubnem izpadu.
4. Statusno preverjanje z neuganljivim tokenom vrne le stanje/receipt, ne osebnih podatkov. Google dogodek na odjemalcu šele ob potrjenem sprejemu in veljavnem soglasju; brez naknadnega obhoda consent.
5. Testi obvezno vključujejo izpad ob enqueue, pred rezervacijo, med send in zapisom receipt, restart workerja, podvojeno dostavo, >24h dvoumnost, DLQ in uskladitev pred ponovnim pošiljanjem. Trajni payload je obdelava poslovnih podatkov, ne dovoljenje za logiranje; potreben pregled zasebnosti in hrambe.

## Osvežitev in ponovitev

Dodana localStorage oznaka `ju-tan-contact-pending-v1` hrani SAMO naključni ključ (brez polj, vsebine, hashov, receipt, oglasnega soglasja). Doda se pred prvim send, briše samo po izrecni success:true; po timeout/503/invalid JSON ostane. Po refreshu/remountu se nov send blokira in uporabnik dobi obstoječe opozorilo za preverjanje po e-pošti. Isti odprti obrazec lahko ponovi nespremenjeno telo z istim ključem. Spremenjeno dvoumno telo ne dobi novega ključa.

To je varnostna blokada, NE trajna obnova oddaje in NE gladka uporabniška rešitev. Marker ostane tudi po znani strežniški zavrnitvi, do nadzorovane razrešitve; to lahko blokira legitimno novo povpraševanje. Pred GO je potreben varen status/recovery tok in izrecna uporabniška odločitev o novi oddaji. Storage nedosegljiv -> brez send; izbris storage/druga naprava in sočasni sveži zavihki so zunaj garancije (localStorage check/set ni medzavihkovna transakcija). Nobene trditve o popolni deduplikaciji po vseh poteh.

## SQL migracija — načrt, ne izvedba

1. Odobriti ciljni testni projekt in bazo, lastnika migracije in povratno različico. Posneti shemo/pravice/vrstice obstoječega agregata, varnostno kopijo in test obnove; brez izvoza produkcijskih kontaktov v CI.
2. Preflight samo z branjem: preveriti current_database/current_user, obstoj in definicije tabel/unikatnih omejitev preko information_schema/pg_catalog ter pravice vloge. CREATE IF NOT EXISTS ni validacija stare napačne sheme. Če tabela že obstaja z drugo definicijo ali manjka pravilni agregat, USTAVI. Ne spreminjaj Office sheme.
3. Na odobrenem testnem okolju začeti transakcijo z lock_timeout 2s in statement_timeout 10s; izvesti pregledano `scripts/sql/contact-idempotency.sql` samo po preflightu. Brez spremembe office_* ali brisanja starih tabel. Migracijo izvaja namenska vloga; kontaktna runtime vloga nima DDL.
4. Preveriti primary key retry_key, TIMESTAMPTZ created_at in counted default false; skladnost dnevnega agregata in datum Europe/Ljubljana. Dodeliti minimalne pravice. Test concurrent insert/count, expiry, izpad in restore. Meje timeout so operativni predlog, ne potrjeno produkcijsko nastavljene vrednosti.
5. Ločeno odobriti produkcijsko migracijo; šele nato preveriti runtime povezavo brez izpisa URL. Privzeto production conversions iz Preview ostanejo blokirane. Ne spreminjati licenčnih spremenljivk.
6. Stari ključi so tombstones, brez samodejnega brisanja. Dogovoriti spremljanje rasti in arhiviranje, ki ohrani zavrnitev starih ključev.

## Povrnitev prejšnje različice

- Pred uvedbo shraniti točen prej delujoči deployment in varno ciljno različico. Vse operacije samo po izrecni odobritvi.
- Sprožilci: veljavna oddaja odpove, pojav dveh sendov za isti ključ, Office smoke test odpove ali napačen consent/conversion dogodek. Ne čakati na prikazane platformne konverzije za zaznavo napake oddaje.
- Najprej ustaviti novo uvedbo in preveriti stanja dvoumnih pošiljanj pri ponudniku. NE ponovno pošiljati avtomatsko.
- Povrnitev kode mora ohraniti ali namensko obravnavati idempotentnost; slepa vrnitev na prvotni main odstrani zaščito in ni enakovredno varna. Če ni združljive povratne različice, začasno jasno ponuditi stik po telefonu/e-pošti brez lažnega potrjevanja obrazca.
- Dodani tabeli in tombstones ostanejo. Ne izvajati DROP, TRUNCATE ali brisanja ključev in ne obnavljati celotne skupne licenčne baze zaradi kontaktnega popravka. V transakciji neuspele še neobjavljene migracije ROLLBACK; po prometu je rollback aplikacijski in aditiven, ne destruktiven.
- Preveriti frontend/backend kompatibilnost ter spremenljivke po povrnitvi. Markerjev obiskovalcev ne brisati na slepo. Preveriti testno Office aktivacijo, validacijo in obnovo tokena, če je to odobreno v testnem okolju.

## Pet napak lint — analiza, ne prisilno izključevanje

1. app/apk/marko/page.tsx: sinhrono setSaved/setReady v mount useEffect. Ločiti branje zunanjega shranjevanja v preverjeno naročniško abstrakcijo/useSyncExternalStore z varnim server snapshotom; test hidratacije, shranjenih dobavnic, izvoza/uvoza in tiska. Ne prepisovati poslovne funkcionalnosti zgolj za lint.
2. Ista stran: notranja domača povezava z navadnim a; minimalni popravek je Next Link z isto vsebino in razredom, preveriti tisk/napravo.
3. FadeIn: sinhrono stanje reduced motion/visible v useEffect. Uporabiti enoten snapshot matchMedia in ustrezno naročnino ali pravilno modelirano inicializacijo; ohraniti SSR, reduced-motion in brez-IntersectionObserver fallback.
4. HeroStageDeferred: sinhroni setVisible za nepodprt IntersectionObserver. Ustrezno zunanje stanje/fallback z nespremenjenim SSR in vizualnim prostorom.
5. OfficeProductStageDeferred: isto za setLoad; ne posegati v licenčne storitve. Potrebni regresiji lazy load in prikaza na starem brskalniku.

Napake so analizirane, niso odpravljene v tej nalogi, saj niso del kontaktnega runtime in popravek zahteva ločene vizualne/poslovne regresije. Pravila niso izključena, ni setTimeout trika za utišanje opozorila. NO-GO ostaja.

## Mobilni vodič

Dodana diagnostika elementFromPoint in nevsiljeni pointer trial pri širinah 320, 390 in 768. Escape se preverja posebej, vendar ne šteje kot uspešen dotik gumba. Rezultat vsake širine je v CI logu GUIDE_HIT_TARGET/GUIDE_POINTER_TRIAL. Diagnostika namenoma ne skrije prekrivanja s force click in njen zelen tek ne pomeni, da pointer deluje. Če se prekrivanje potrdi, je GO blokiran do najmanjšega pregledanega stacking/portal popravka in novega resničnega pointer testa.

## Google Tag Assistant + Resend — končni odobreni test

Najprej izoliran Preview/testni Resend račun ali omejen testni prejemnik brez realnih strank; nova trajna vrsta samo če je posebej odobrena. Namerno pošiljanje v produkcijo, tudi sintetično, zahteva odobritev.
- Nov profil: brez izbire, Samo nujno, oglasi-only, analitika-only, preklic med nalaganjem, ponoven sprejem. Preveriti vsa 4 consent stanja in da ni conversion ob obisku, kliku ali napaki. Ne nameščati dodatnega GTM.
- Glavni obrazec in vodič: 1 dovoljena uspešna oddaja; success:true, stabilen conversionId in transaction_id za AW-18531808239/YQbkCOaJz7gdEO_n04RF. Brez osebnih podatkov v merilnih parametrih ali CI dokazih.
- Resend: preveriti accepted/sent/delivered/bounced kot ločena stanja; isti ključ in telo vrneta isti receipt brez dveh sendov. Dostava v nabiralnik ni zagotovljena s statusom accepted. Brez slepih resendov ob lost response.
- Dvojni klik, timeout po sprejemu, refresh po timeout, remount, blokator, stale onload in izčrpan retry. Prava e-pošta največ enkrat na isti logični ključ. Marker/recovery tok mora omogočiti varno razrešitev brez novega send.
- Preveriti neodvisnost Office v odobrenem testnem okolju. Ne uporabljati pravih licenc v CI.
- Po 24–48h pregledati diagnostiko kot nadaljnji pregled, ne jamstvo časa osvežitve. Test brez klika oglasa ne jamči pripisane konverzije; lastnega oglasa ne klikati.

## Ranljivosti

`p0-release-review.mjs` izvede samo `npm audit --json` in `npm explain` proti nameščenemu lockfile, izpiše vsako prizadeto knjižnico, različico, neposrednost, advisory URL, pot in fixAvailable. To ni npm audit fix; ni nadgradenj ali prisilnih overrides. Število 14 iz prejšnjega npm ci ni nujno 14 neodvisnih CVE. Končna analiza se navezuje na dejanski pregled registra v CI, ne na spomin ali ugibanje. Runtime dosegljivost zahteva pregled uporabe in deploya, ne samo dev:false.

Viri: https://vercel.com/docs/rbac/access-roles ; https://vercel.com/docs/environment-variables/sensitive-environment-variables ; https://vercel.com/docs/queues/concepts ; https://resend.com/docs/dashboard/emails/idempotency-keys

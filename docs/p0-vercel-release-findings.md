# PR #93 — zaključek bralnega pregleda Vercela in odvisnosti

Pregled 27. 11. 2026. **NO-GO**. Dokument dopolnjuje in ima prednost pred starejšimi sklepi v `p0-production-readiness.md` in `google-ads-p0-hardening.md`. Nobene spremembe nastavitev Vercela, vrednosti skrivnosti, SQL v produkciji, mergea, produkcijskega deploya, Google Ads ali resničnih testnih oddaj.

## Kaj je dejansko prebrano v Vercelu

Uporabnik je dokončal prijavo v deljenem brskalniku. Projekt JU-TAN Studio / ju-tan-web je povezan z jurezaki-cloud/ju-tan-web in domenama ju-tan.com / www.ju-tan.com. Produkcijski Overview kaže Ready, main, `908a06f72ca47f6014350f036d1de4adbfc6eb15`, objavljeno 19. 11. PR #93 ostaja ločena Preview veja in ima avtomatske Preview objave; nobena ni bila promovirana.

Pregled Settings brez sprememb:
- Next.js, prazna root directory (koren), brez build/install/output override.
- Node 24.x. System Environment Variables so omogočene. To je podlaga za Vercel sistemske spremenljivke, NE pregled njihove dejanske vrednosti v že zgrajenem odjemalcu.
- Fluid Compute omogočen; označena regija iad1; Standard CPU; privzeta max duration v polju ni posebej nastavljena (placeholder 300). Function Failover disabled. To so trenutne projektne nastavitve, ne dokaz vseh omejitev posamezne objavljene funkcije.
- Deployment Checks: No checks configured. Rolling Releases disabled. Git build behavior Automatic. Nobene nastavitve nisem vklopil ali shranil.
- Neon ju-tan-licenses je Connected. To ne dokazuje sheme, pravic, gostitelja ali razpoložljivosti baze in NI dovoljenje za migracijo Office baze.

### Okoljske spremenljivke — samo imena in obsegi

Prebran je celoten vidni seznam Project pri All Types / All Environments / All Editors / All Variables, brez iskalnega filtra. Shared tab: No shared variables linked. Nobene vrednosti nisem odprl, kopiral ali izvozil.

- CONTACT_DATABASE_URL ni naveden.
- RESEND_API_KEY ni naveden; EMAIL_FROM in FROM_EMAIL nista navedena.
- DATABASE_URL in Neon DATABASE_* imena so navedena za Production and Preview.
- JU_TAN_LICENSE_KEY_PEPPER in JU_TAN_LICENSE_TOKEN_SECRET imata ločeni Production in Preview vrstici; vrednosti in enakost med okoljema nista preverjeni.
- CRON_SECRET, JU_TAN_LICENSE_ADMIN_SECRET in JU_TAN_OFFICE_INSTALLER_URL so navedeni za Production.

`getMailConfig` zahteva RESEND_API_KEY in EMAIL_FROM ali FROM_EMAIL. Ta trenutni seznam zato ne izpolnjuje zahtev za novo produkcijsko objavo. Vercel Deployment Ready ni dokaz delujočega obrazca. **Odsotnost v trenutnih nastavitvah NE dokazuje odsotnosti v zgodovinskem okolju že objavljenega deploymenta** in ni dokaz dejanske izgube povpraševanj. Nobenega testa oddaje ali razkritja skrivnosti za to diagnozo nismo izvedli. Potreben je pregled imen/obsegov konkretne objave in posebej odobren test.

Dodatnih pisalnih dovoljenj nismo zahtevali. Za nadaljevanje zadostuje ogled ustreznega projekta in redigiranih dnevnikov; če Viewer logov ne omogoča, jih lastnik pokaže ali redigira sam. Ne širiti dostopa na druge projekte.

## Zadnji preverjeni runtime kandidat

`934f419275cca198774b41fbd0fdc7ae87282f99`.
- CI https://github.com/jurezaki-cloud/ju-tan-web/actions/runs/45963757041
- Security/isolation https://github.com/jurezaki-cloud/ju-tan-web/actions/runs/45963757139

Rezultati:
- typecheck, build, scoped lint: uspešno;
- celoten lint in neodvisni baseline main: neuspešno, istih pet predhodnih napak;
- P0 enotske regresije: uspešno;
- kontaktni test s pravim lokalnim PostgreSQL in nadomestnim Resend: uspešno;
- contact-isolation test brez veljavnih Office skrivnosti/poola: uspešno;
- hardening, free-lab, SEO, magic, inventar drugih izvozljivih preverjanj: uspešno;
- browser: **27 uspešnih, 1 neuspešen od 28**, ne uporabiti prejšnjega rezultata 28/28 za ta kandidat.

Browser neuspeh: pri 320 px po kliku odpiralnega gumba vodič ni bil najden v 5 s. Diagnoza vzroka (časovni pogoj proti dejanski UI napaki) ni zaključena. Pri 390 px je zapiralni gumb v viewportu in 44 × 44 px, vendar center zadene element glave (path) in nevsiljeni pointer trial odpove. Pri 768 px center zadene pravi gumb in pointer trial uspe. Prejšnji kandidat je potrdil isto prekrivanje pri 320 px. Escape ni dokaz delujočega gumba. Zelen diagnostični podtest pri 390 px zgolj zabeleži stanje, ne odpravlja napake. Objava ostaja blokirana do minimalnega pregledanega UI popravka ter dejanskega pointer/touch testa vseh širin.

## Analiza vseh 14 npm audit vnosov

Vir: `npm audit --json` in `npm explain`, uspešen audit CI zgoraj, lockfile nespremenjen. 14 moderate, 0 high, 0 critical. To je **14 prizadetih imen paketov**, ne 14 neodvisnih CVE: audit navaja dve izvorni opozorili in dedovane poti do staršev. Za vsak vnos `fixAvailable:true` NE pomeni, da je katerakoli predlagana nadgradnja že preizkušena ali brez večje spremembe.

| Paket | Nameščeno | Pot / izvor opozorila | Ocena in varen naslednji korak |
|---|---|---|---|
| @sentry/bundler-plugins | 10.78.0 | @sentry/nextjs → bundler-plugins → glob | Dedovano. Prednost: Sentry build veriga; preveriti podprto nadgradnjo starša in sourcemap build. |
| @sentry/nextjs | 10.78.0 | neposredna prod odvisnost; preko bundler in webpack plugina | Dedovano, ni dokaz ranljivega spletnega API. Potrebna preverba dejanskega bundle/stacka in izolirana nadgradnja Sentry. |
| @sentry/webpack-plugin | 5.4.1 | Sentry Next → webpack-plugin → bundler → glob | Dedovano. Test buildov, source maps in brez razkritja auth/source vsebin. |
| @ts-morph/common | 0.27.0 | shadcn → ts-morph → common → minimatch | Dev veriga. Pregledati zaupanja vredne CLI vhode, nadgraditi prek starša. |
| @typescript-eslint/eslint-plugin | 8.72.1 | eslint-config-next → typescript-eslint; type-utils/utils → estree → minimatch | Dev dedovano. Nadgraditi združljivo celotno skupino, preveriti lint pravila. |
| @typescript-eslint/parser | 8.72.1 | typescript-eslint → parser → estree → minimatch | Dev dedovano. Uskladiti parser/plugin različice, ne globalni minimatch override. |
| @typescript-eslint/type-utils | 8.72.1 | eslint-plugin → type-utils → estree/utils → minimatch | Dev dedovano. Enaka združljiva orodna nadgradnja. |
| @typescript-eslint/typescript-estree | 8.72.1 | typescript-eslint → estree → minimatch | Dev neposredni nosilec prehoda v minimatch. Preveriti glob konfiguracijo orodij in celoten type/lint CI. |
| @typescript-eslint/utils | 8.72.1 | eslint-plugin / typescript-eslint → utils → estree | Dev dedovano. Nadgraditi skupaj z estree in parserjem. |
| glob | 13.0.6 | Sentry bundler → glob; tudi deduje minimatch | Izvorno GHSA-3g3m-2fjr-6pw4: preklic lahko še naprej bere datotečni sistem. Audit range >=9.0.0 <=14.0.1. Ne obljubljati popravka zgolj z bumpom brez pregleda izdaje in integracije. |
| minimatch | 10.2.6 (3 gnezdene kopije) | common, estree in glob | Izvorno GHSA-g3hv-75wg-m249: zlonameren vzorec in optimizationLevel >=2 lahko povzročita CPU/pomnilniški DoS. Audit range >=7 <11.0.1. Root kopija 3.1.5 je v npm explain, vendar NI v prizadetih nodes tega opozorila. |
| shadcn | 4.23.0 | neposredna dev → ts-morph → common → minimatch | Dedovano. CLI samo v zaupanja vrednem razvoju; pregledana posodobitev starša in test generiranih komponent, brez ponovne generacije dizajna. |
| ts-morph | 26.0.0 | shadcn → ts-morph → common → minimatch | Dev dedovano. Nadgraditi prek združljivega shadcn; preveriti AST/CLI vedenje. |
| typescript-eslint | 8.72.1 | eslint-config-next → typescript-eslint → parser/plugin/estree/utils | Dev dedovano. Usklajena skupina, pregled peer zahtev z obstoječim ESLint in Next config. |

Obe izvorni ranljivosti sta razpoložljivostni. Zlonamerni vzorci/drevesa in dosegljiva uporaba so predpogoj; naš pregled NE potrjuje oddaljene izkoristljivosti prek kontaktnega obrazca, niti ne dokazuje, da vse prizadete build poti manjkajo v deployed bundle. Dev:false na Sentry/glob ni samodejno spletni endpoint. Registry audit ni pentest in njegova uspešna izvedba ne pomeni audit brez ranljivosti.

Varen načrt: ločena odvisnostna veja, pregled nove izdaje neposrednih staršev in peer zahtev, minimalen lockfile diff, ponovno npm audit + vse regresije + test Sentry build in obstoječih komponent. Ne uporabljati npm audit fix --force, slepih overrides ali neselektivnega odstranjevanja Sentry/shadcn. Paketi v tem PR niso nadgrajeni.

Advisory vira:
- https://github.com/advisories/GHSA-3g3m-2fjr-6pw4
- https://github.com/advisories/GHSA-g3hv-75wg-m249

## Preostale odločitve pred GO

1. Zagotoviti in preveriti namensko CONTACT_DATABASE_URL ter e-poštno konfiguracijo brez vrednosti v poročilih. Nova kontaktna povezava ne sme pasti nazaj na Office skrivnosti. Dejanska vloga in ločena infrastruktura še nista pripravljeni ali potrjeni.
2. Najvišja razpoložljivost ob izpadu PostgreSQL NI implementirana. Trenutni fail-closed prepreči nezaščiten send, vendar ne sprejme trajno novega povpraševanja. Neodvisen trajni vhod/vrsta, varovanje osebnih vsebin, retention, idempotenten worker in >24h karantena so načrt iz p0-production-readiness.md, ne obstoječa storitev.
3. Pending marker prepreči preprost novi send po refreshu, a potrebuje varen recovery/status tok. Ne brisati ga avtomatsko samo za boljši UX; multi-tab in izbris storage nista atomarno rešena.
4. Pet lint napak je analiziranih po datotekah v p0-production-readiness.md, ne odpravljenih ali izključenih. Mobilni gumb in 320 px neuspeh ostajata blokatorja.
5. Migracijski/rollback načrt je pripravljen; nobene operacije niso izvedene. Najprej testna baza, omejena runtime vloga, preflight obstoječe sheme, backup/restore, dodajalna transakcija in ohranitev tombstones. Ne dotikati Office tabel.
6. Tag Assistant + Resend načrt je pripravljen; realno testiranje obeh obrazcev in testna Office aktivacija zahtevata posebej odobreno okolje in oddaje. ID-ji, soglasje in Google Ads ostajajo nespremenjeni.

**Končna presoja: NO-GO.** Vercel pregled je zaključen samo z branjem; za nobeno produkcijsko spremembo ni podana izvedbena odobritev.

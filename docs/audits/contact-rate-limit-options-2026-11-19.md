# Kontaktni obrazec — varnostni pregled omejevanja zahtev

Datum: 19. 11. 2026  
Status: raziskava in regresijski testi; brez sprememb kontaktnega API-ja ali produkcijskih nastavitev.

## Ugotovljeno v izvorni kodi

- `lib/rate-limit.ts` trenutno uporablja pomnilniški `MemoryRateLimitStore` za 8 zahtev na identifikator v 10 minutah.
- `clientKey` daje prednost glavi `x-real-ip`; ob odsotnosti uporabi prvi naslov v `x-forwarded-for`.
- `app/api/contact/route.ts` trenutno preveri omejitev zahtev pred razčlenjevanjem JSON in preverjanjem honeypota.
- `tests/contact-rate-limit.test.ts` zabeleži obstoječe vedenje, tudi dokaz, da dva neodvisna primerka razreda ne delita stanja.

## Preverjene možnosti

**Možnost A — Vercel WAF (predlagana prva presoja):** Vercel uradno podpira rate limiting na robu infrastrukture. Primerna je za omejevanje zahtev do `POST /api/contact` še pred aplikacijo. Pred vklopom je treba preveriti pogoje in stroške, zlasti kvoto ter vpliv na legitimne uporabnike na skupnem IP. Prvo pravilo se uvede ločeno in previdno, z monitoringom in načrtom vrnitve na prejšnje stanje.

**Možnost B — distribuirani rate-limit store:** uporaba podatkovne shrambe, skupne med funkcijskimi instancami. To je večja sprememba kode, zato zahteva ločen načrt dosegljivosti, odpovedi, hrambe in varovanja podatkov.

**IP glave:** Vercel dokumentacija opisuje svoje upravljanje `x-forwarded-for` in `x-real-ip` glave. Zaupanje glavam mora izhajati iz dejanske infrastrukture, ne samo iz imena glave. Ne sklepati o ponarejanju brez reprodukcije.

Viri:
- https://vercel.com/docs/headers/request-headers
- https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting
- https://vercel.com/docs/vercel-firewall/vercel-waf/usage-and-pricing
- https://vercel.com/kb/guide/add-rate-limiting-vercel

## Kaj omogočajo novi testi

Šest testov obstoječega vedenja: mejna kvota, ločeni identifikatorji, izbira `x-real-ip`, nadomestna `x-forwarded-for`, brez IP glave ter neodvisnost pomnilniških instanc. To ni integracijski ali penetracijski test in ne potrjuje zaščite med različnimi Vercel instancami.

## Meje spremembe

- Nespremenjeni so `app/api/contact/route.ts`, `lib/rate-limit.ts`, Resend, kontaktni obrazec, DNS in požarni zid.
- Niso poslane resnične zahteve API-ju in nobene testne e-pošte.
- Ni združitve v `main` ali produkcijske objave.

## Pred nadaljnjo implementacijo

1. Preveriti možnost, ceno in dejansko konfiguracijo Vercel WAF za ta projekt.
2. Pripraviti ločeno, revizijsko sledljivo pravilo s previdno mejo in možnostjo takojšnjega izklopa.
3. Dodati funkcionalne teste `429` in obnašanja pri napaki, ki ne vplivajo na produkcijske obiskovalce.
4. Potrebna je izrecna odobritev pred spremembo požarnega zidu in pred produkcijsko objavo.

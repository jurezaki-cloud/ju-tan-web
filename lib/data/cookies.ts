import { IDENTITY_COOKIE_ACCESS, IDENTITY_COOKIE_REFRESH } from "@/src/identity/config";
import { ANALYTICS_CONSENT_KEY } from "@/lib/consent";

export const cookiesLastUpdated = "16. 9. 2026";

export const cookieRows = [
  {
    name: IDENTITY_COOKIE_ACCESS,
    type: "Nujen",
    store: "Piškotek (httpOnly)",
    purpose: "Seja notranje platforme po prijavi. Brez njega prijava ne deluje.",
    duration: "Do 8 ur, ob »zapomni si me« do 30 dni",
  },
  {
    name: IDENTITY_COOKIE_REFRESH,
    type: "Nujen",
    store: "Piškotek (httpOnly)",
    purpose: "Obnova seje notranje platforme.",
    duration: "Do 14 dni",
  },
  {
    name: ANALYTICS_CONSENT_KEY,
    type: "Nujen",
    store: "localStorage",
    purpose: "Shrani izbiro pasice (analitika da / samo nujno).",
    duration: "Dokler ne zbrišete podatkov brskalnika",
  },
  {
    name: "theme",
    type: "Nujen",
    store: "localStorage",
    purpose: "Izbrana svetla ali temna tema (next-themes).",
    duration: "Dokler ne zbrišete podatkov brskalnika",
  },
  {
    name: "jutan-ai-agent",
    type: "Funkcijski",
    store: "localStorage",
    purpose: "Zgodovina vodiča storitev na javnem spletnem mestu. Ni pogovorni model.",
    duration: "Dokler ne zbrišete podatkov brskalnika",
  },
  {
    name: "Vercel Analytics / Speed Insights",
    type: "Analitični",
    store: "Skripta gostitelja",
    purpose: "Merjenje obiska. Naloži se samo po »Sprejmem« v pasici.",
    duration: "Po pravilih Vercel Analytics",
  },
] as const;

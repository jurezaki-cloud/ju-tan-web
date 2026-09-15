import { services } from "@/lib/data/services";
import { company } from "@/lib/data/company";

export type AgentRole = "assistant" | "user";

export type AgentMessage = {
  id: string;
  role: AgentRole;
  text: string;
};

export const AGENT_STORAGE_KEY = "jutan-ai-agent";

export const welcomeMessage: AgentMessage = {
  id: "welcome",
  role: "assistant",
  text: `Pozdravljeni.

To je vodič po storitvah JU-TAN — kratki, vnaprej pripravljeni odgovori, ne pogovorni model.

Izberite temo ali opišite sistem, ki vas ovira.`,
};

export const serviceOptions = services.map((service) => service.title);

export const quickActions = [
  ...services.map((service) => ({
    label: service.title,
    prompt: service.title,
  })),
  { label: "Želim ponudbo", prompt: "Želim ponudbo" },
];

export const budgetOptions = [
  "Do 5.000 €",
  "5.000–15.000 €",
  "Nad 15.000 €",
  "Po dogovoru",
] as const;

export const deadlineOptions = [
  "Do 2 tedna",
  "1 mesec",
  "2–3 mesece",
  "Več kot 3 mesece",
  "Po dogovoru",
] as const;

const replies: { keys: string[]; answer: string }[] = [
  {
    keys: ["umetn", "ai rešit", "agent"],
    answer:
      "Pripravimo AI agente in pomočnike, ki se povežejo z vašimi obstoječimi orodji. Za oceno obsega izberite »Želim ponudbo«.",
  },
  {
    keys: ["avtomat", "proces", "workflow"],
    answer:
      "Avtomatizacija poveže API-je in odpravi ponavljajoče delo. Opišite trenutni postopek, predlagamo konkreten tok.",
  },
  {
    keys: ["programsk", "namizn", "software", "razvoj"],
    answer:
      "Programsko opremo razvijemo po meri: jasna arhitektura, integracije in vzdrževanje. Opišite proces, ki ga želite digitalizirati.",
  },
  {
    keys: ["splet", "website", "portal"],
    answer:
      "Spletne aplikacije zasnujemo odzivno, hitro in z merjenjem. Povejte cilj (predstavitev, povpraševanja, interno orodje).",
  },
  {
    keys: ["infrastruk", "strež", "docker", "oblak", "cloud"],
    answer:
      "Za infrastrukturo uredimo namestitev, kopije in nadzor. Povejte, kje danes teče produkcija.",
  },
  {
    keys: ["varnost", "kibernet", "dostop"],
    answer:
      "Pri varnosti se osredotočimo na dostope, politike in pregled ranljivosti — ne na marketinški pentest, če ga ne izvajamo kot ločeno storitev. Opišite okolje.",
  },
  {
    keys: ["kontakt", "telefon", "klic"],
    answer: `Razvoj
${company.contact.phone}

${company.contact.phoneSecondaryLabel}
${company.contact.phoneSecondary}

Ali izberite »Želim ponudbo« in izpolnite obrazec.`,
  },
];

export function replyToPrompt(input: string) {
  const text = input.trim().toLowerCase();
  if (!text) return "Napišite kratko vprašanje ali izberite hitri gumb.";

  const match = replies.find((item) =>
    item.keys.some((key) => text.includes(key)),
  );
  return (
    match?.answer ??
    "Povejte, katero storitev potrebujete, ali izberite hitri gumb. Za oceno izberite »Želim ponudbo«."
  );
}

export function isOfferIntent(input: string) {
  const text = input.trim().toLowerCase();
  return (
    text.includes("želim ponudbo") ||
    text.includes("zelim ponudbo") ||
    text.includes("ponudb") ||
    text.includes("povpraš")
  );
}

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
    keys: ["umetn", "ai", "agent"],
    answer:
      "AI agenti berejo obstoječe sisteme in pripravijo osnutke ali prenose. Za oceno obsega izberite »Želim ponudbo«.",
  },
  {
    keys: ["crm", "prodaj", "stik"],
    answer:
      "CRM pokrije stranke, priložnosti in zgodovino komunikacije v enem toku. Opišite, kje danes vodite zapise.",
  },
  {
    keys: ["erp", "zalog", "dokument"],
    answer:
      "ERP moduli pokrijejo dokumente, zalogo in interne procese. Povejte, kateri del želite najprej urediti.",
  },
  {
    keys: ["portal", "splet", "website"],
    answer:
      "Portali dajo strankam ali partnerjem dostop do ponudbe, zahtevkov in statusa. Opišite, kdo bo uporabljal dostop.",
  },
  {
    keys: ["mobil", "android", "ios", "aplikac"],
    answer:
      "Mobilne aplikacije berejo in pišejo v isti API kot ostali sistemi. Povejte, ali gre za teren, prodajo ali interno ekipo.",
  },
  {
    keys: ["saas", "najem"],
    answer:
      "SaaS jedro loči podatke po računih strank. Opišite, koliko organizacij naj hkrati uporablja izdelek.",
  },
  {
    keys: ["api", "integrac", "računovod"],
    answer:
      "API integracije uskladijo CRM, ERP in računovodstvo. Navedite sisteme, ki jih je treba povezati.",
  },
  {
    keys: ["avtomat", "workflow", "proces"],
    answer:
      "Poslovna avtomatizacija sproži dejanja ob dogodkih v sistemih. Opišite trenutni ročni korak.",
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

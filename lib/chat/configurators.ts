import type { FlowId, FlowQuestion } from "./types";

/** Koraki konfiguratorja po izbrani storitvi. */
export const flowCatalog: Record<FlowId, { title: string; questions: FlowQuestion[] }> = {
  website: {
    title: "Spletna stran",
    questions: [
      { id: "activity", prompt: "Kakšna je dejavnost podjetja ali projekta?" },
      {
        id: "pages",
        prompt: "Koliko podstrani predvidevate?",
        options: ["1–5", "6–10", "11 ali več"],
      },
      {
        id: "languages",
        prompt: "Potrebujete več jezikov?",
        options: ["Da", "Ne"],
      },
      {
        id: "blog",
        prompt: "Potrebujete blog?",
        options: ["Da", "Ne"],
      },
      {
        id: "ai",
        prompt: "Potrebujete AI pomočnika na strani?",
        options: ["Da", "Ne"],
      },
      {
        id: "form",
        prompt: "Potrebujete kontaktni obrazec?",
        options: ["Da", "Ne"],
      },
      {
        id: "booking",
        prompt: "Potrebujete rezervacije?",
        options: ["Da", "Ne"],
      },
    ],
  },
  software: {
    title: "Program po meri",
    questions: [
      {
        id: "desktop",
        prompt: "Potrebujete namizni program?",
        options: ["Da", "Ne"],
      },
      {
        id: "webapp",
        prompt: "Potrebujete spletno aplikacijo?",
        options: ["Da", "Ne"],
      },
      {
        id: "mobile",
        prompt: "Potrebujete mobilno aplikacijo?",
        options: ["Da", "Ne"],
      },
      {
        id: "database",
        prompt: "Potrebujete bazo podatkov?",
        options: ["Da", "Ne"],
      },
      {
        id: "multiuser",
        prompt: "Bo uporabljalo več uporabnikov?",
        options: ["Da", "Ne"],
      },
      {
        id: "auth",
        prompt: "Potrebujete prijavo uporabnikov?",
        options: ["Da", "Ne"],
      },
      {
        id: "integrations",
        prompt: "Potrebujete integracije z drugimi sistemi?",
        options: ["Da", "Ne"],
      },
    ],
  },
  mobile: {
    title: "Mobilna aplikacija",
    questions: [
      {
        id: "platform",
        prompt: "Za katero platformo razvijamo aplikacijo?",
        options: ["Android", "iPhone", "Oboje"],
      },
      {
        id: "gps",
        prompt: "Potrebujete GPS?",
        options: ["Da", "Ne"],
      },
      {
        id: "camera",
        prompt: "Potrebujete kamero?",
        options: ["Da", "Ne"],
      },
      {
        id: "qr",
        prompt: "Potrebujete branje QR kod?",
        options: ["Da", "Ne"],
      },
      {
        id: "notifications",
        prompt: "Potrebujete obvestila?",
        options: ["Da", "Ne"],
      },
      {
        id: "payments",
        prompt: "Potrebujete plačila?",
        options: ["Da", "Ne"],
      },
    ],
  },
};

const labels: Record<string, string> = {
  activity: "Dejavnost",
  pages: "Podstrani",
  languages: "Več jezikov",
  blog: "Blog",
  ai: "AI pomočnik",
  form: "Kontaktni obrazec",
  booking: "Rezervacije",
  desktop: "Namizni program",
  webapp: "Spletna aplikacija",
  mobile: "Mobilna aplikacija",
  database: "Baza podatkov",
  multiuser: "Več uporabnikov",
  auth: "Prijava uporabnikov",
  integrations: "Integracije",
  platform: "Platforma",
  gps: "GPS",
  camera: "Kamera",
  qr: "QR",
  notifications: "Obvestila",
  payments: "Plačila",
};

export function formatFlowSummary(
  flowId: FlowId,
  answers: Record<string, string>,
) {
  const catalog = flowCatalog[flowId];
  const lines = catalog.questions.map((question) => {
    const label = labels[question.id] ?? question.id;
    return `• ${label}: ${answers[question.id] ?? "—"}`;
  });

  return `Povzetek – ${catalog.title}

${lines.join("\n")}

Pripravimo tehnični predlog in oceno. Nadaljujte s povpraševanjem v razdelku Kontakt ali nas pokličite.`;
}

export function detectFlow(text: string): FlowId | null {
  const value = text.toLowerCase();

  if (
    value.includes("spletna stran") ||
    value.includes("izdelava splet") ||
    value.includes("🌐")
  ) {
    return "website";
  }

  if (
    value.includes("program po meri") ||
    value.includes("programska") ||
    value.includes("💻")
  ) {
    return "software";
  }

  if (
    value.includes("mobilna") ||
    value.includes("android") ||
    value.includes("iphone") ||
    value.includes("📱")
  ) {
    return "mobile";
  }

  return null;
}

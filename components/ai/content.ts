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
  text: `Pozdravljeni 👋

Sem JU-TAN AI.

Pomagam vam izbrati pravo digitalno rešitev.

Kako vam lahko pomagam?`,
};

export const quickActions = [
  { label: "🤖 AI rešitve", prompt: "AI rešitve" },
  { label: "🌐 Spletne strani", prompt: "Spletne strani" },
  { label: "💻 Programska oprema", prompt: "Programska oprema" },
  { label: "📱 Mobilne aplikacije", prompt: "Mobilne aplikacije" },
  { label: "🎨 Grafično oblikovanje", prompt: "Grafično oblikovanje" },
  { label: "🎬 Video produkcija", prompt: "Video produkcija" },
  { label: "⚙️ Avtomatizacija", prompt: "Avtomatizacija" },
  { label: "💬 Želim ponudbo", prompt: "Želim ponudbo" },
] as const;

export const serviceOptions = [
  "AI rešitve",
  "Spletne strani",
  "Programska oprema",
  "Mobilne aplikacije",
  "Grafično oblikovanje",
  "Video produkcija",
  "Avtomatizacija",
] as const;

export const budgetOptions = [
  "Do 2.000 €",
  "2.000–5.000 €",
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
    keys: ["ai rešit", "umetn", "agent"],
    answer:
      "Za AI rešitve pripravimo pomočnike in agente po meri: hitrejše delo ekipe, avtomatizacija dokumentov in povezava z vašimi orodji. Če želite oceno, izberite »Želim ponudbo«.",
  },
  {
    keys: ["splet", "website", "stran"],
    answer:
      "Spletne strani zasnujemo odzivno, hitro in s poudarkom na pretvorbi obiskovalcev. Povejte cilj (predstavitev, prodaja, povpraševanja) ali oddajte kratko povpraševanje.",
  },
  {
    keys: ["programsk", "namizn", "software"],
    answer:
      "Programsko opremo razvijemo po meri: jasna arhitektura, prijava uporabnikov in integracije. Opišite proces, ki ga želite digitalizirati.",
  },
  {
    keys: ["mobiln", "android", "ios", "iphone"],
    answer:
      "Mobilne aplikacije izdelamo za Android, iPhone ali oboje. Lahko vključimo obvestila, kamero, GPS ali plačila. Povejte, kdo jo bo uporabljal.",
  },
  {
    keys: ["grafič", "oblikov", "logotip"],
    answer:
      "Pri grafičnem oblikovanju poskrbimo za prepoznavno identiteto, logotip in vizuale za splet ali tisk. Opišite znamko in želeni vtis.",
  },
  {
    keys: ["video", "produkcij", "animacij"],
    answer:
      "Video produkcija vključuje predstavitvene filme, animacije in vsebine za splet. Povejte namen (oglas, predstavitev, družbena omrežja).",
  },
  {
    keys: ["avtomat", "proces", "workflow"],
    answer:
      "Avtomatizacija poveže orodja in odpravi ponavljajoče delo. Opišite trenutni postopek, predlagamo konkreten tok.",
  },
  {
    keys: ["kontakt", "telefon", "klic"],
    answer: `Razvoj
+386 69 907 803

Marketing / Svetovanje
+386 69 983 936

Ali izberite »Želim ponudbo« in izpolnite obrazec.`,
  },
];

export function replyToPrompt(input: string) {
  const text = input.trim().toLowerCase();
  if (!text) return "Napišite kratko vprašanje ali izberite hitri gumb.";

  const match = replies.find((item) => item.keys.some((key) => text.includes(key)));
  return (
    match?.answer ??
    "Povejte, katero rešitev potrebujete, ali izberite hitri gumb. Za konkretno oceno izberite »Želim ponudbo«."
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

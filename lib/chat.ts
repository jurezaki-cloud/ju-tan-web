import { company } from "@/lib/data/company";

export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  role: ChatRole;
  text: string;
};

export const CHAT_STORAGE_KEY = "jutan-ai-history";

export const welcomeMessage: ChatMessage = {
  role: "assistant",
  text: `Pozdravljeni!

Sem JU-TAN AI, vaš digitalni pomočnik.

Pomagam vam pri:
• umetni inteligenci,
• izdelavi spletnih strani,
• razvoju programskih rešitev,
• mobilnih aplikacijah,
• grafičnem oblikovanju,
• video produkciji,
• avtomatizaciji poslovnih procesov.

Kako vam lahko pomagam?`,
};

export const quickActions = [
  { label: "AI rešitve", prompt: "AI rešitve" },
  { label: "Izdelava spletne strani", prompt: "Izdelava spletne strani" },
  { label: "Mobilne aplikacije", prompt: "Mobilne aplikacije" },
  { label: "Programska oprema", prompt: "Programska oprema" },
  { label: "Grafično oblikovanje", prompt: "Grafično oblikovanje" },
  { label: "Video produkcija", prompt: "Video produkcija" },
  { label: "Kontakt", prompt: "Kontakt" },
  { label: "Brezplačno povpraševanje", prompt: "Brezplačno povpraševanje" },
] as const;

export const contactReply = `${company.contact.phoneLabel}
${company.contact.phone}

${company.contact.phoneSecondaryLabel}
${company.contact.phoneSecondary}

Pišite tudi na ${company.contact.email}. Odgovorimo ${company.contact.hours.toLowerCase()}.`;

const knowledge: { keys: string[]; answer: string }[] = [
  {
    keys: ["kontakt", "telefon", "klic", "email", "pošta", "poklič"],
    answer: contactReply,
  },
  {
    keys: ["ai", "umetn", "agent", "chatgpt", "llm"],
    answer:
      "Za umetno inteligenco priporočamo AI agente in pomočnike po meri, ki pospešijo delo ekipe, avtomatizirajo dokumentacijo in se povežejo z vašimi orodji. Začnemo s kratko analizo procesov, nato predlagamo konkreten agent. Rezervirajte posvet ali izpolnite povpraševanje.",
  },
  {
    keys: ["splet", "website", "landing", "stran"],
    answer:
      "Za izdelavo spletne strani priporočamo sodobno, odzivno in SEO pripravljeno spletno rešitev s premium vmesnikom. Primerna je za predstavitev podjetja, povpraševanja in rast prometa. Povejte nam cilj strani, pripravimo predlog.",
  },
  {
    keys: ["mobiln", "android", "ios", "aplikac"],
    answer:
      "Za mobilne aplikacije razvijamo rešitve za Android in iOS, prilagojene vašemu poslovanju. Poskrbimo za jasno uporabniško izkušnjo, stabilnost in nadaljnje nadgradnje. Opišite, kaj mora aplikacija omogočati.",
  },
  {
    keys: ["programsk", "namizn", "software", "sistem", "crm"],
    answer:
      "Za programsko opremo priporočamo poslovno aplikacijo po meri: jasna arhitektura, povezave z obstoječimi orodji in dolgoročno vzdrževanje. Najpogosteje začnemo s kratko analizo zahtev in predlogom obsega.",
  },
  {
    keys: ["grafič", "oblikov", "design", "logotip", "vizual"],
    answer:
      "Za grafično oblikovanje pripravimo vizualno identiteto, logotip, tiskovine in spletne vizuale, usklajene z vašo znamko. Cilj je prepoznaven in profesionalen vtis. Pošljite kratko povpraševanje z želenim obsegom.",
  },
  {
    keys: ["video", "produkcij", "animacij", "spot"],
    answer:
      "Za video produkcijo izdelamo predstavitvene filme, animacije in vsebine za splet ali družbena omrežja. Predlagamo scenarij, vizualni slog in format glede na cilj kampanje.",
  },
  {
    keys: ["avtomat", "proces", "workflow", "n8n", "zapier"],
    answer:
      "Za avtomatizacijo poslovnih procesov povežemo orodja in API-je, da ekipa manj dela ročno. Prihranite čas pri ponavljajočih opravilih, obvestilih in prenosu podatkov. Opišite trenutni postopek, predlagamo rešitev.",
  },
  {
    keys: ["povpraš", "ponudb", "brezplač", "cena", "stane", "proračun"],
    answer:
      "Brezplačno povpraševanje oddate v razdelku Kontakt. Opišite izziv, mi pripravimo usmerjen predlog. Cena je odvisna od obsega; najpogosteje začnemo s kratko analizo. Lahko tudi rezervirate posvet.",
  },
  {
    keys: ["rezerv", "termin", "posvet", "booking"],
    answer:
      "Termin rezervirate v razdelku Rezervacija: izberete storitev, svetovalca (Tanja Hrup ali Jure Zakrajšek), datum in uro.",
  },
  {
    keys: ["storit", "ponuja", "delate", "rešit"],
    answer:
      "JU-TAN ponuja umetno inteligenco, spletne strani in aplikacije, programsko opremo, mobilne aplikacije, grafično oblikovanje, video produkcijo, avtomatizacijo in IT svetovanje. Povejte, kaj potrebujete, predlagam naslednji korak.",
  },
  {
    keys: ["kako", "postopek", "sodelovan", "začn"],
    answer:
      "Sodelovanje: analiza, načrtovanje, razvoj, testiranje, implementacija in dolgoročna podpora. Za začetek izpolnite povpraševanje ali rezervirajte posvet.",
  },
];

export function replyToMessage(input: string): string {
  const text = input.trim().toLowerCase();
  if (!text) return "Napišite kratko vprašanje, da vam lahko pomagam.";

  const match = knowledge.find((item) =>
    item.keys.some((key) => text.includes(key)),
  );

  return (
    match?.answer ??
    "Hvala za vprašanje. Povejte, ali potrebujete AI, splet, programsko opremo, mobilno aplikacijo, oblikovanje, video ali avtomatizacijo. Za konkreten predlog izpolnite povpraševanje ali nas pokličite."
  );
}

export function readChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [welcomeMessage];

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [welcomeMessage];

    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [welcomeMessage];

    return parsed.filter(
      (item) =>
        item &&
        (item.role === "assistant" || item.role === "user") &&
        typeof item.text === "string",
    );
  } catch {
    return [welcomeMessage];
  }
}

export function writeChatHistory(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
}

export function subscribeChatHistory(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("jutan-ai-history", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("jutan-ai-history", onStoreChange);
  };
}

export function getChatHistorySnapshot() {
  return JSON.stringify(readChatHistory());
}

export function getChatHistoryServerSnapshot() {
  return JSON.stringify([welcomeMessage]);
}

export function publishChatHistory(messages: ChatMessage[]) {
  writeChatHistory(messages);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("jutan-ai-history"));
  }
}

export function clearChatHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHAT_STORAGE_KEY);
  window.dispatchEvent(new Event("jutan-ai-history"));
}

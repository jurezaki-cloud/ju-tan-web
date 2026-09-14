import { company } from "@/lib/data/company";

export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  role: ChatRole;
  text: string;
};

export const suggestedQuestions = [
  "Katere storitve ponujate?",
  "Kako poteka sodelovanje?",
  "Kako rezerviram posvet?",
  "Kje vas lahko kontaktiram?",
];

const knowledge: { keys: string[]; answer: string }[] = [
  {
    keys: ["storit", "ponuja", "delate", "rešit"],
    answer:
      "JU-TAN razvija umetno inteligenco, spletne strani in aplikacije, namizne in mobilne programe, oblikovanje, video, avtomatizacijo in IT svetovanje.",
  },
  {
    keys: ["ai", "agent", "umetn"],
    answer:
      "Izdelamo AI agente in pomočnike, ki pospešijo delo ekipe, avtomatizirajo dokumentacijo in se povežejo z vašimi orodji.",
  },
  {
    keys: ["rezerv", "termin", "posvet", "booking"],
    answer:
      "Termin rezervirate v sekciji Rezervacija: izberete storitev, svetovalca, datum in uro.",
  },
  {
    keys: ["cena", "stane", "ponudb", "proračun"],
    answer:
      "Cena je odvisna od obsega. Najpogosteje začnemo s kratko analizo. Rezervirajte posvet ali izpolnite kontaktni obrazec.",
  },
  {
    keys: ["kontakt", "email", "pošta", "telefon", "klic"],
    answer:
      `${company.contact.phoneLabel}: ${company.contact.phone}. ${company.contact.phoneSecondaryLabel}: ${company.contact.phoneSecondary}. Pišite na ${company.contact.email} ali uporabite obrazec Kontakt. Odgovorimo ${company.contact.hours.toLowerCase()}.`,
  },
  {
    keys: ["kako", "postopek", "sodelovan", "začn"],
    answer:
      "Sodelovanje: analiza, načrtovanje, razvoj, testiranje, implementacija in dolgoročna podpora.",
  },
  {
    keys: ["mobiln", "android", "ios", "namizn"],
    answer:
      "Razvijamo tudi mobilne aplikacije za Android in iOS ter namizne programe po meri.",
  },
];

export const welcomeMessage: ChatMessage = {
  role: "assistant",
  text: "Pozdravljeni, sem JU-TAN pomočnik. Vprašajte me o storitvah, rezervaciji ali kontaktu.",
};

export function replyToMessage(input: string): string {
  const text = input.trim().toLowerCase();
  if (!text) return "Napišite kratko vprašanje, da vam lahko pomagam.";

  const match = knowledge.find((item) =>
    item.keys.some((key) => text.includes(key)),
  );

  return (
    match?.answer ??
    "Hvala za vprašanje. Za konkreten predlog rezervirajte posvet ali izpolnite kontaktni obrazec."
  );
}

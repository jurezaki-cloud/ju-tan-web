import { company } from "@/lib/data/company";

export const welcomeText = `Pozdravljeni!

Sem JU-TAN AI.

Pomagam pri:

• umetni inteligenci
• izdelavi spletnih strani
• razvoju programske opreme
• mobilnih aplikacijah
• grafičnem oblikovanju
• video produkciji
• avtomatizaciji

Kako vam lahko pomagam?`;

export const contactReply = `${company.contact.phoneLabel}
${company.contact.phone}

${company.contact.phoneSecondaryLabel}
${company.contact.phoneSecondary}`;

export const quickActions = [
  { label: "🤖 AI rešitve", prompt: "AI rešitve" },
  { label: "🌐 Spletna stran", prompt: "Spletna stran" },
  { label: "💻 Program po meri", prompt: "Program po meri" },
  { label: "📱 Mobilna aplikacija", prompt: "Mobilna aplikacija" },
  { label: "🎨 Grafično oblikovanje", prompt: "Grafično oblikovanje" },
  { label: "🎬 Video produkcija", prompt: "Video produkcija" },
  { label: "📞 Kontakt", prompt: "Kontakt" },
  { label: "📝 Brezplačno povpraševanje", prompt: "Brezplačno povpraševanje" },
] as const;

const knowledge: { keys: string[]; answer: string }[] = [
  {
    keys: ["kontakt", "telefon", "klic", "poklič", "📞"],
    answer: contactReply,
  },
  {
    keys: ["ai rešit", "umetn", "agent", "llm"],
    answer:
      "Za AI rešitve priporočamo pomočnike in agente po meri: avtomatizacija dokumentacije, odgovori strankam in povezava z vašimi orodji. Začnemo s kratko analizo procesov. Oddajte povpraševanje ali rezervirajte posvet.",
  },
  {
    keys: ["grafič", "oblikov", "logotip", "🎨"],
    answer:
      "Za grafično oblikovanje pripravimo identiteto, logotip in vizuale za splet ali tisk. Opišite znamko in obseg, predlagamo slog in naslednje korake.",
  },
  {
    keys: ["video", "produkcij", "🎬"],
    answer:
      "Za video produkcijo izdelamo predstavitvene filme, animacije in vsebine za splet. Povejte cilj (predstavitev, oglas, družbena omrežja), predlagamo format.",
  },
  {
    keys: ["avtomat", "proces", "workflow"],
    answer:
      "Za avtomatizacijo povežemo orodja in odpravimo ponavljajoče delo. Opišite trenutni postopek, predlagamo konkreten tok.",
  },
  {
    keys: ["povpraš", "ponudb", "brezplač", "cena", "📝"],
    answer:
      "Brezplačno povpraševanje oddate v razdelku Kontakt. Opišite izziv; pripravimo usmerjen predlog. Cena je odvisna od obsega.",
  },
  {
    keys: ["rezerv", "termin", "posvet"],
    answer:
      "Termin rezervirate v razdelku Rezervacija: storitev, svetovalec, datum in ura.",
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
    "Povejte, ali potrebujete AI, spletno stran, program po meri, mobilno aplikacijo, oblikovanje ali video. Lahko izberete tudi hitri gumb zgoraj."
  );
}

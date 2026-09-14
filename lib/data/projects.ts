import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    title: "JU-TAN AI Platform",
    category: "Umetna inteligenca",
    description:
      "Osrednja platforma za AI agente, avtomatizacijo nalog in inteligentno podporo poslovnim procesom.",
    technologies: ["OpenAI", "Python", "Next.js"],
    image: "ai-platform",
  },
  {
    title: "JU-TAN Office",
    category: "Poslovna programska oprema",
    description:
      "Celovita poslovna aplikacija z moduli za stranke, ponudbe, račune, skladišče in analitiko.",
    technologies: ["Python", "TypeScript", "PostgreSQL"],
    image: "office",
  },
  {
    title: "AI Chatbot",
    category: "Umetna inteligenca",
    description:
      "Pogovorni asistent, ki odgovarja na vprašanja strank, razbremeni podporo in deluje 24/7.",
    technologies: ["OpenAI", "FastAPI", "React"],
    image: "chatbot",
  },
  {
    title: "CRM Sistem",
    category: "Poslovna programska oprema",
    description:
      "Sistem za upravljanje strank, priložnosti in komunikacije z jasnim pregledom prodajnega lijaka.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    image: "crm",
  },
  {
    title: "ERP Integracija",
    category: "Avtomatizacija",
    description:
      "Povezava obstoječih ERP sistemov z avtomatiziranimi tokovi podatkov, poročili in nadzorom.",
    technologies: ["Python", "FastAPI", "Docker"],
    image: "erp",
  },
  {
    title: "Spletni Portal",
    category: "Spletni razvoj",
    description:
      "Sodobni portal za stranke in partnerje z varnim dostopom, vsebino in oblačno infrastrukturo.",
    technologies: ["React", "Next.js", "Cloud"],
    image: "portal",
  },
];

import type { Project } from "@/lib/types";

export const projectFilters = [
  "Vse",
  "AI",
  "Splet",
  "Avtomatizacija",
] as const;

export type ProjectFilter = (typeof projectFilters)[number];

export function projectMatchesFilter(
  project: Project,
  filter: ProjectFilter,
): boolean {
  if (filter === "Vse") return true;
  return project.tags.includes(filter);
}

export const projects: Project[] = [
  {
    title: "Poslovni informacijski sistem",
    category: "ERP • CRM",
    description:
      "Enoten pregled strank, dokumentov in ekipe v enem sistemu.",
    result: "Manj podvojenega vnosa med orodji.",
    technologies: ["React", "TypeScript", "Python", "PostgreSQL"],
    image: "office",
    tags: ["Avtomatizacija"],
    conceptual: true,
  },
  {
    title: "AI agent za administracijo",
    category: "AI • Avtomatizacija",
    description:
      "Pomočnik, ki prevzame ponavljajoča opravila v podpori in administraciji.",
    result: "Manj ročnega prepisovanja med sistemi.",
    technologies: ["OpenAI", "Python", "FastAPI", "Docker"],
    image: "ai-agent",
    tags: ["AI", "Avtomatizacija"],
    conceptual: true,
  },
  {
    title: "Spletni portal",
    category: "Spletna platforma",
    description:
      "Hitra spletna rešitev za predstavitev ponudbe in povpraševanja.",
    result: "Krajša pot od obiska do prvega stika.",
    technologies: ["Next.js", "React", "TypeScript", "Cloud"],
    image: "portal",
    tags: ["Splet"],
    conceptual: true,
  },
  {
    title: "CRM za prodajni tok",
    category: "Poslovna programska oprema",
    description:
      "Upravljanje strank, priložnosti in komunikacije na enem mestu.",
    result: "Pregleden pipeline brez izgubljenih zapisov v preglednicah.",
    technologies: ["React", "API", "PostgreSQL", "Cloud"],
    image: "crm",
    tags: ["Avtomatizacija", "Splet"],
    conceptual: true,
  },
  {
    title: "Oblačna infrastruktura",
    category: "Infrastruktura",
    description:
      "Namestitev, nadzor in varnostne kopije za produkcijsko okolje.",
    result: "Predvidljivo vzdrževanje in obnovitev.",
    technologies: ["Docker", "Linux", "Cloud", "Backup"],
    image: "infra",
    tags: ["Splet"],
    conceptual: true,
  },
  {
    title: "Nadzor dostopov",
    category: "Kibernetska varnost",
    description:
      "Zaščita podatkov, dostopov in poslovnih informacijskih sistemov.",
    result: "Nadzorovan dostop in manjša izpostavljenost.",
    technologies: ["Firewall", "VPN", "Monitoring", "Security"],
    image: "security",
    tags: ["Avtomatizacija"],
    conceptual: true,
  },
];

import type { Project } from "@/lib/types";

export const projectFilters = [
  "Vse",
  "AI",
  "Web",
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
    title: "JU-TAN Office",
    category: "ERP • CRM",
    description:
      "Poslovni informacijski sistem za stranke, dokumente in ekipe.",
    result: "Manj ročnega vnosa in enoten pregled poslovanja.",
    technologies: ["React", "TypeScript", "Python", "PostgreSQL"],
    image: "office",
    tags: ["Avtomatizacija"],
  },
  {
    title: "JU-TAN AI Agent",
    category: "AI • Avtomatizacija",
    description:
      "Pametni AI pomočnik, ki prevzame ponavljajoča poslovna opravila.",
    result: "Do 70 % manj ponavljajočih nalog v podpori in administraciji.",
    technologies: ["OpenAI", "Python", "FastAPI", "Docker"],
    image: "ai-agent",
    tags: ["AI", "Avtomatizacija"],
  },
  {
    title: "Spletni Portal",
    category: "Spletna platforma",
    description:
      "Hitra, odzivna spletna rešitev za predstavitev in povpraševanja.",
    result: "Jasnejša pot do stranke in hitrejši prvi stik.",
    technologies: ["Next.js", "React", "TypeScript", "Cloud"],
    image: "portal",
    tags: ["Web"],
  },
  {
    title: "CRM Platform",
    category: "Poslovna programska oprema",
    description:
      "Sistem za upravljanje strank, priložnosti in komunikacije.",
    result: "Pregled pipeline-a in manj izgubljenih priložnosti.",
    technologies: ["React", "API", "PostgreSQL", "Cloud"],
    image: "crm",
    tags: ["Avtomatizacija", "Web"],
  },
  {
    title: "Cloud Infrastructure",
    category: "Infrastruktura",
    description:
      "Zanesljiva oblačna infrastruktura z nadzorom in varnostnimi kopijami.",
    result: "Stabilnejše delovanje in predvidljivo vzdrževanje.",
    technologies: ["Docker", "Linux", "Cloud", "Backup"],
    image: "infra",
    tags: ["Web"],
  },
  {
    title: "Cyber Security",
    category: "Kibernetska varnost",
    description:
      "Zaščita podatkov, dostopov in poslovnih informacijskih sistemov.",
    result: "Manjše tveganje vdora in nadzorovan dostop do sistemov.",
    technologies: ["Firewall", "VPN", "Monitoring", "Security"],
    image: "security",
    tags: ["Avtomatizacija"],
  },
];

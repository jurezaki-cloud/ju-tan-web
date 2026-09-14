import type { Project } from "@/lib/types";

export const projectFilters = [
  "Vsi",
  "AI",
  "Web",
  "Business",
  "Infrastructure",
  "Security",
] as const;

export type ProjectFilter = (typeof projectFilters)[number];

export function projectMatchesFilter(
  project: Project,
  filter: ProjectFilter,
): boolean {
  if (filter === "Vsi") return true;

  const haystack = `${project.title} ${project.category}`.toLowerCase();

  switch (filter) {
    case "AI":
      return haystack.includes("ai");
    case "Web":
      return haystack.includes("web");
    case "Business":
      return (
        haystack.includes("business") ||
        haystack.includes("erp") ||
        haystack.includes("crm")
      );
    case "Infrastructure":
      return haystack.includes("infrastructure");
    case "Security":
      return haystack.includes("security");
    default:
      return true;
  }
}

export const projects: Project[] = [
  {
    title: "JU-TAN Office",
    category: "ERP • CRM",
    description:
      "Poslovni informacijski sistem za upravljanje podjetja.",
    technologies: ["React", "TypeScript", "Python", "PostgreSQL"],
    image: "office",
  },
  {
    title: "JU-TAN AI Agent",
    category: "AI • Automation",
    description:
      "Pametni AI pomočnik za avtomatizacijo poslovnih procesov.",
    technologies: ["OpenAI", "Python", "FastAPI", "Docker"],
    image: "ai-agent",
  },
  {
    title: "Spletni Portal",
    category: "Web Platform",
    description: "Razvoj modernih spletnih aplikacij.",
    technologies: ["Next.js", "React", "TypeScript", "Cloud"],
    image: "portal",
  },
  {
    title: "CRM Platform",
    category: "Business Software",
    description: "Napreden sistem za upravljanje strank.",
    technologies: ["React", "API", "Database", "Cloud"],
    image: "crm",
  },
  {
    title: "Cloud Infrastructure",
    category: "Infrastructure",
    description:
      "Načrtovanje in upravljanje zanesljive IT infrastrukture.",
    technologies: ["Docker", "Linux", "Cloud", "Backup"],
    image: "infra",
  },
  {
    title: "Cyber Security",
    category: "Security",
    description: "Zaščita poslovnih informacijskih sistemov.",
    technologies: ["Firewall", "VPN", "Monitoring", "Security"],
    image: "security",
  },
];

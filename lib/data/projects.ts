import type { Project } from "@/lib/types";
import { Bot, Cable, Cloud, Database, Globe, Users } from "lucide-react";

export const projectFilters = [
  "Vse",
  "CRM",
  "ERP",
  "AI",
  "Portal",
  "SaaS",
  "Integracija",
] as const;

export type ProjectFilter = (typeof projectFilters)[number];

export function projectMatchesFilter(
  project: Project,
  filter: ProjectFilter,
): boolean {
  if (filter === "Vse") return true;
  return project.tags.some((tag) => tag === filter);
}

export const projects: Project[] = [
  {
    title: "Prodajni tok in stiki",
    category: "CRM",
    description:
      "Stranke, priložnosti in komunikacija v enem zapisu namesto po pošti in preglednicah.",
    result: "Pregled pipelinea in manj izgubljenih zapisov.",
    technologies: ["React", "API", "PostgreSQL"],
    image: "crm",
    icon: Users,
    tags: ["CRM"],
    conceptual: true,
  },
  {
    title: "Dokumenti in interni procesi",
    category: "ERP",
    description:
      "Zaloga, dokumenti in ekipa v istem viru podatkov.",
    result: "Enkratni vnos namesto usklajevanja med orodji.",
    technologies: ["React", "TypeScript", "PostgreSQL"],
    image: "office",
    icon: Database,
    tags: ["ERP"],
    conceptual: true,
  },
  {
    title: "Agent za administracijo",
    category: "AI",
    description:
      "Osnutki in prenosi podatkov iz obstoječih sistemov, kjer so opravila ponavljajoča.",
    result: "Manj ročnega prepisovanja med orodji.",
    technologies: ["Python", "API", "Docker"],
    image: "ai-agent",
    icon: Bot,
    tags: ["AI"],
    conceptual: true,
  },
  {
    title: "Dostop strank in partnerjev",
    category: "Portal",
    description:
      "Prijava, vloge in status zahtevkov, povezan na notranje sisteme.",
    result: "Krajša pot od zahteve do obdelave.",
    technologies: ["Next.js", "TypeScript", "Cloud"],
    image: "portal",
    icon: Globe,
    tags: ["Portal"],
    conceptual: true,
  },
  {
    title: "Večnajemniški izdelek",
    category: "SaaS",
    description:
      "Računi, vloge in ločeni podatki za več strank na istem jedru.",
    result: "Eno jedro kode, ločeni računi.",
    technologies: ["React", "API", "PostgreSQL"],
    image: "infra",
    icon: Cloud,
    tags: ["SaaS"],
    conceptual: true,
  },
  {
    title: "Povezava obstoječih sistemov",
    category: "Integracija",
    description:
      "Sinhronizacija med CRM, ERP in računovodstvom prek stabilnih vmesnikov.",
    result: "Ažurni podatki brez dvojnega vnosa.",
    technologies: ["API", "Python", "Cloud"],
    image: "security",
    icon: Cable,
    tags: ["Integracija"],
    conceptual: true,
  },
];

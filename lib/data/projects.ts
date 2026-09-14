import type { Project } from "@/lib/types";

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

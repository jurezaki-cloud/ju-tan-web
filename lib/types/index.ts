import type { LucideIcon } from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export type ProjectTag = "AI" | "Splet" | "Avtomatizacija";

export interface Project {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  result: string;
  image: string;
  tags: readonly ProjectTag[];
  conceptual: boolean;
}

export interface Technology {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface ProcessStep {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

import type { LucideIcon } from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  problem: string;
  solution: string;
  result: string;
  description: string;
  stack: string[];
}

export type ProjectTag =
  | "CRM"
  | "ERP"
  | "AI"
  | "Portal"
  | "SaaS"
  | "Integracija";

export interface Project {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  result: string;
  image: string;
  icon: LucideIcon;
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
  stack: string[];
}

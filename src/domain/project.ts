export type ProjectStatus =
  | "Načrt"
  | "V teku"
  | "Testiranje"
  | "Uvedba"
  | "Zaključeno";

export type Priority = "Nizka" | "Srednja" | "Visoka";

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  progress: number;
  owner: string;
  due: string;
  priority: Priority;
}

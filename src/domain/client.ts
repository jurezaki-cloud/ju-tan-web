export type ContactStatus = "Aktiven" | "Novo" | "Neaktiven";

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: ContactStatus;
  city: string;
  contactName: string;
  email: string;
  phone: string;
  notes: string[];
}

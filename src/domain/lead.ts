import type { ContactStatus } from "./client";

export type LeadStatus = ContactStatus;

export interface Lead {
  id: string;
  name: string;
  company: string;
  companyId: string;
  status: LeadStatus;
  phone: string;
  email: string;
  lastContact: string;
}

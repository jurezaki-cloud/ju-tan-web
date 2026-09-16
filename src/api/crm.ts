import { crmService } from "@/src/services/CRMService";
import type { Lead } from "@/src/domain/lead";
import type { Result } from "@/src/types/platform";

export async function getLeads(): Promise<Result<Lead[]>> {
  return crmService.listLeads();
}

export async function createLead(input: Omit<Lead, "id">): Promise<Result<Lead>> {
  return crmService.createLead(input);
}

import { opportunityRepository } from "@/src/repositories/OpportunityRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Opportunity } from "@/src/domain/crm";
import type { CrmListResult, CrmQueryParams, OpportunityWrite } from "@/src/types/crm";
import { recordCrmAudit } from "./crmAudit";
import { systemCrmAccess, type CrmAccess } from "./crmAccess";
import { nextCrmId, stampCrm } from "./crmStamp";

export class OpportunityService {
  list(params: CrmQueryParams = {}, access: CrmAccess = systemCrmAccess): Result<CrmListResult<Opportunity>> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    try {
      return ok(opportunityRepository.list(params));
    } catch {
      return err("Priložnosti ni bilo mogoče naložiti.");
    }
  }

  getById(id: string, access: CrmAccess = systemCrmAccess): Result<Opportunity> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    const item = opportunityRepository.getById(id);
    if (!item) return err("Priložnost ne obstaja.");
    return ok(item);
  }

  getByClientId(clientId: string): Result<Opportunity[]> {
    return ok(opportunityRepository.getByClientId(clientId));
  }

  create(input: OpportunityWrite, access: CrmAccess = systemCrmAccess): Result<Opportunity> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    if (!input.name.trim()) return err("Ime priložnosti je obvezno.");
    const item = stampCrm<Opportunity>(nextCrmId("op", opportunityRepository.count()), input.status ?? input.stage ?? "open", {
      name: input.name.trim(),
      company: input.company ?? "",
      source: "manual",
      owner: input.owner ?? "",
      clientId: input.clientId,
      leadId: input.leadId,
      amount: input.amount,
      closeDate: input.closeDate,
      probability: input.probability,
      stage: input.stage ?? "Kvalifikacija",
    });
    opportunityRepository.create(item);
    recordCrmAudit("OpportunityCreated", { id: item.id, clientId: item.clientId });
    return ok(item);
  }

  update(id: string, input: Partial<OpportunityWrite>, access: CrmAccess = systemCrmAccess): Result<Opportunity> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    const current = opportunityRepository.getById(id);
    if (!current) return err("Priložnost ne obstaja.");
    const next = { ...current, ...input, updatedAt: new Date().toISOString(), version: (current.version ?? 1) + 1 };
    if (input.stage && input.stage !== current.stage) {
      next.metadata = { ...current.metadata, previousStage: current.stage };
    }
    opportunityRepository.update(next);
    return ok(next);
  }

  archive(id: string, access: CrmAccess = systemCrmAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const done = opportunityRepository.archive(id);
    if (done) recordCrmAudit("RecordArchived", { id, type: "opportunity" });
    return ok(done);
  }

  restore(id: string, access: CrmAccess = systemCrmAccess): Result<Opportunity> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    const item = opportunityRepository.restore(id);
    if (!item) return err("Priložnosti ni bilo mogoče obnoviti.");
    recordCrmAudit("RecordRestored", { id, type: "opportunity" });
    return ok(item);
  }
}

export const opportunityService = new OpportunityService();

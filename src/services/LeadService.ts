import { leadRepository } from "@/src/repositories/LeadRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Lead } from "@/src/domain/lead";
import type { LeadWrite } from "@/src/types/crm";
import { recordCrmAudit } from "./crmAudit";
import { systemCrmAccess, type CrmAccess } from "./crmAccess";

export class LeadService {
  list(): Result<Lead[]> {
    try {
      return ok(leadRepository.list());
    } catch {
      return err("Stikov ni bilo mogoče naložiti.");
    }
  }

  getById(id: string): Result<Lead> {
    const lead = leadRepository.getById(id);
    if (!lead) return err("Stik ne obstaja.");
    return ok(lead);
  }

  getByClientId(clientId: string): Result<Lead[]> {
    return ok(leadRepository.getByClientId(clientId));
  }

  search(query: string): Result<Lead[]> {
    return ok(leadRepository.search(query));
  }

  createLead(input: Omit<Lead, "id">): Result<Lead> {
    try {
      const lead = leadRepository.create(input);
      recordCrmAudit("LeadCreated", { id: lead.id });
      return ok(lead);
    } catch {
      return err("Stika ni bilo mogoče ustvariti.");
    }
  }

  create(input: LeadWrite, access: CrmAccess = systemCrmAccess): Result<Lead> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    if (!input.name.trim() || !input.company.trim()) return err("Ime in podjetje sta obvezna.");
    return this.createLead({
      name: input.name.trim(),
      company: input.company.trim(),
      companyId: input.clientId ?? "",
      status: (input.status as Lead["status"]) || "Novo",
      phone: input.phone ?? "",
      email: input.email ?? "",
      lastContact: input.lastContact ?? new Date().toLocaleDateString("sl-SI"),
    });
  }

  update(id: string, input: Partial<LeadWrite>, access: CrmAccess = systemCrmAccess): Result<Lead> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    const current = leadRepository.getById(id);
    if (!current) return err("Stik ne obstaja.");
    const next: Lead = {
      ...current,
      name: input.name?.trim() || current.name,
      company: input.company?.trim() || current.company,
      companyId: input.clientId ?? current.companyId,
      status: (input.status as Lead["status"]) || current.status,
      phone: input.phone ?? current.phone,
      email: input.email ?? current.email,
      lastContact: input.lastContact ?? current.lastContact,
    };
    leadRepository.save(next);
    recordCrmAudit("LeadUpdated", { id });
    return ok(next);
  }

  archive(id: string, access: CrmAccess = systemCrmAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const done = leadRepository.archive(id);
    if (done) recordCrmAudit("RecordArchived", { id, type: "lead" });
    return ok(done);
  }

  restore(id: string, access: CrmAccess = systemCrmAccess): Result<Lead> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    leadRepository.restore(id);
    const item = leadRepository.getById(id);
    if (!item) return err("Stika ni bilo mogoče obnoviti.");
    recordCrmAudit("RecordRestored", { id, type: "lead" });
    return ok(item);
  }
}

export const leadService = new LeadService();

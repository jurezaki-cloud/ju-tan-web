import { contactRepository } from "@/src/repositories/ContactRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Contact } from "@/src/domain/crm";
import type { ContactWrite, CrmListResult, CrmQueryParams } from "@/src/types/crm";
import { recordCrmAudit } from "./crmAudit";
import { crmAccessFor, systemCrmAccess, type CrmAccess } from "./crmAccess";
import { nextCrmId, stampCrm } from "./crmStamp";

export class ContactService {
  list(params: CrmQueryParams = {}, access: CrmAccess = systemCrmAccess): Result<CrmListResult<Contact>> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    try {
      return ok(contactRepository.list(params));
    } catch {
      return err("Kontaktov ni bilo mogoče naložiti.");
    }
  }

  getById(id: string, access: CrmAccess = systemCrmAccess): Result<Contact> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    const item = contactRepository.getById(id);
    if (!item) return err("Kontakt ne obstaja.");
    return ok(item);
  }

  getByClientId(clientId: string, access: CrmAccess = systemCrmAccess): Result<Contact[]> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    return ok(contactRepository.getByClientId(clientId));
  }

  create(input: ContactWrite, access: CrmAccess = systemCrmAccess): Result<Contact> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    if (!input.firstName.trim() || !input.lastName.trim()) return err("Ime in priimek sta obvezna.");
    const item = stampCrm<Contact>(nextCrmId("ct", contactRepository.count()), input.status ?? "active", {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email,
      phone: input.phone,
      role: input.role,
      clientId: input.clientId,
      leadId: input.leadId,
      name: `${input.firstName} ${input.lastName}`.trim(),
    });
    contactRepository.create(item);
    recordCrmAudit("ContactCreated", { id: item.id, clientId: item.clientId });
    return ok(item);
  }

  update(id: string, input: Partial<ContactWrite>, access: CrmAccess = systemCrmAccess): Result<Contact> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    const current = contactRepository.getById(id);
    if (!current) return err("Kontakt ne obstaja.");
    const next = {
      ...current,
      ...input,
      name: `${input.firstName ?? current.firstName} ${input.lastName ?? current.lastName}`.trim(),
      updatedAt: new Date().toISOString(),
      version: (current.version ?? 1) + 1,
    };
    return ok(contactRepository.update(next));
  }

  archive(id: string, access: CrmAccess = systemCrmAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const okFlag = contactRepository.archive(id);
    if (okFlag) recordCrmAudit("RecordArchived", { id, type: "contact" });
    return ok(okFlag);
  }

  restore(id: string, access: CrmAccess = systemCrmAccess): Result<Contact> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    const item = contactRepository.restore(id);
    if (!item) return err("Kontakta ni bilo mogoče obnoviti.");
    recordCrmAudit("RecordRestored", { id, type: "contact" });
    return ok(item);
  }
}

export const contactService = new ContactService();
export { crmAccessFor };

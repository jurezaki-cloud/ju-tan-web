import { clientRepository } from "@/src/repositories/ClientRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Client } from "@/src/domain/client";
import type { Client as CrmClient } from "@/src/domain/crm";
import type { ClientWrite } from "@/src/types/crm";
import { recordCrmAudit } from "./crmAudit";
import { systemCrmAccess, type CrmAccess } from "./crmAccess";
import { nextCrmId, stampCrm } from "./crmStamp";

export class ClientService {
  list(): Result<Client[]> {
    try {
      return ok(clientRepository.list());
    } catch {
      return err("Strank ni bilo mogoče naložiti.");
    }
  }

  getById(id: string): Result<Client> {
    const client = clientRepository.getById(id);
    if (!client) return err("Stranka ne obstaja.");
    return ok(client);
  }

  search(query: string): Result<Client[]> {
    try {
      return ok(clientRepository.search(query));
    } catch {
      return err("Iskanje strank ni uspelo.");
    }
  }

  create(input: ClientWrite, access: CrmAccess = systemCrmAccess): Result<Client> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    if (!input.name.trim()) return err("Ime stranke je obvezno.");
    const id = nextCrmId("cl", clientRepository.count());
    const client: Client = {
      id,
      name: input.name.trim(),
      industry: input.industry ?? "",
      status: (input.status as Client["status"]) || "Novo",
      city: input.city ?? "",
      contactName: input.contactName ?? "",
      email: input.email ?? "",
      phone: input.phone ?? "",
      notes: input.notes ?? [],
    };
    clientRepository.save(client);
    const crm = stampCrm<CrmClient>(id, client.status, {
      name: client.name,
      company: input.company ?? client.name,
      website: input.website,
      email: client.email,
      phone: client.phone,
      industry: client.industry,
      city: client.city,
      contactName: client.contactName,
      notes: client.notes,
      source: input.source ?? "manual",
      owner: input.owner ?? "",
    });
    clientRepository.saveCrm(crm);
    recordCrmAudit("ClientCreated", { id });
    return ok(client);
  }

  update(id: string, input: Partial<ClientWrite>, access: CrmAccess = systemCrmAccess): Result<Client> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    const current = clientRepository.getById(id);
    if (!current) return err("Stranka ne obstaja.");
    const next: Client = {
      ...current,
      name: input.name?.trim() || current.name,
      industry: input.industry ?? current.industry,
      status: (input.status as Client["status"]) || current.status,
      city: input.city ?? current.city,
      contactName: input.contactName ?? current.contactName,
      email: input.email ?? current.email,
      phone: input.phone ?? current.phone,
      notes: input.notes ?? current.notes,
    };
    clientRepository.save(next);
    recordCrmAudit("ClientUpdated", { id });
    return ok(next);
  }

  archive(id: string, access: CrmAccess = systemCrmAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const done = clientRepository.archive(id);
    if (done) recordCrmAudit("RecordArchived", { id, type: "client" });
    return ok(done);
  }

  restore(id: string, access: CrmAccess = systemCrmAccess): Result<Client> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    clientRepository.restore(id);
    const item = clientRepository.getById(id);
    if (!item) return err("Stranke ni bilo mogoče obnoviti.");
    recordCrmAudit("RecordRestored", { id, type: "client" });
    return ok(item);
  }
}

export const clientService = new ClientService();

import type { Client } from "@/src/domain/client";
import type { Client as CrmClient } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import type { RepositoryAdapter } from "@/src/types/persistence";
import { CrmEntityMapper } from "@/src/persistence/mappers/crm.mapper";
import { CrmRepository } from "./crm/CrmRepository";
import { defaultTenant } from "@/src/persistence/entities";

const crmMapper = new CrmEntityMapper<CrmClient>();

function toCrm(client: Client): CrmClient {
  return crmMapper.toDomain({
    id: client.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: client.status,
    metadata: {},
    tenantId: appPersistence.tenant.tenantId,
    organizationId: appPersistence.tenant.organizationId,
    workspaceId: appPersistence.tenant.workspaceId ?? defaultTenant.workspaceId,
    version: 1,
    data: {
      ...client,
      company: client.name,
      website: "",
      industry: client.industry,
      city: client.city,
      contactName: client.contactName,
      notes: client.notes,
    },
  });
}

function toPlatform(client: CrmClient): Client {
  return {
    id: client.id,
    name: client.company || client.name,
    industry: client.industry ?? "",
    status: (client.status as Client["status"]) || "Novo",
    city: client.city ?? "",
    contactName: client.contactName ?? client.owner ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    notes: client.notes ?? [],
  };
}

export class ClientRepository {
  private readonly crm: CrmRepository<CrmClient>;

  constructor(
    private readonly records: RepositoryAdapter<Client> = appPersistence.repositories.clients,
  ) {
    this.crm = new CrmRepository("clients", {
      list: (options) => this.records.list(options).map(toCrm),
      getById: (id) => {
        const found = this.records.getById(id);
        return found ? toCrm(found) : undefined;
      },
      getByIds: (ids) => ids.map((id) => this.getCrmById(id)).filter((item): item is CrmClient => Boolean(item)),
      save: (entity) => {
        this.records.save(toPlatform(entity));
        return entity;
      },
      archive: (id) => this.records.archive(id),
      delete: (id) => this.records.delete(id),
    });
  }

  list(): Client[] {
    return this.records.list();
  }

  getById(id: string): Client | undefined {
    return this.records.getById(id);
  }

  save(client: Client): Client {
    return this.records.save(client);
  }

  archive(id: string): boolean {
    return this.records.archive(id);
  }

  restore(id: string) {
    return this.crm.restore(id);
  }

  search(query: string): Client[] {
    return this.records.list({ search: query, searchFields: ["name", "email", "industry"] });
  }

  count(): number {
    return this.list().length;
  }

  listCrm() {
    return this.crm.list();
  }

  getCrmById(id: string) {
    return this.crm.getById(id);
  }

  saveCrm(client: CrmClient) {
    return this.crm.update(client);
  }

  crmStore() {
    return this.crm;
  }
}

export const clientRepository = new ClientRepository();

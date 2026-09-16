import type { Lead } from "@/src/domain/lead";
import type { Lead as CrmLead } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import type { RepositoryAdapter } from "@/src/types/persistence";
import { CrmEntityMapper } from "@/src/persistence/mappers/crm.mapper";
import { CrmRepository } from "./crm/CrmRepository";
import { defaultTenant } from "@/src/persistence/entities";

const mapper = new CrmEntityMapper<CrmLead>();

function toCrm(lead: Lead): CrmLead {
  return mapper.toDomain({
    id: lead.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: lead.status,
    metadata: {},
    tenantId: appPersistence.tenant.tenantId,
    organizationId: appPersistence.tenant.organizationId,
    workspaceId: appPersistence.tenant.workspaceId ?? defaultTenant.workspaceId,
    version: 1,
    data: {
      ...lead,
      clientId: lead.companyId,
      source: "platform",
      owner: "",
      pipelineStage: lead.status,
    },
  });
}

function toPlatform(lead: CrmLead): Lead {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    companyId: lead.clientId ?? "",
    status: (lead.status as Lead["status"]) || "Novo",
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    lastContact: lead.lastContact ?? "",
  };
}

export class LeadRepository {
  private readonly crm: CrmRepository<CrmLead>;

  constructor(private readonly records: RepositoryAdapter<Lead> = appPersistence.repositories.leads) {
    this.crm = new CrmRepository("leads", {
      list: (options) => this.records.list(options).map(toCrm),
      getById: (id) => {
        const found = this.records.getById(id);
        return found ? toCrm(found) : undefined;
      },
      getByIds: (ids) => this.records.getByIds(ids).map(toCrm),
      save: (entity) => {
        this.records.save(toPlatform(entity));
        return entity;
      },
      archive: (id) => this.records.archive(id),
      delete: (id) => this.records.delete(id),
    });
  }

  list(): Lead[] {
    return this.records.list();
  }

  getById(id: string): Lead | undefined {
    return this.records.getById(id);
  }

  create(input: Omit<Lead, "id">): Lead {
    const lead: Lead = { ...input, id: `c-${String(this.list().length + 1).padStart(2, "0")}` };
    return this.records.save(lead);
  }

  save(lead: Lead): Lead {
    return this.records.save(lead);
  }

  archive(id: string): boolean {
    return this.records.archive(id);
  }

  restore(id: string) {
    return this.crm.restore(id);
  }

  search(query: string): Lead[] {
    return this.records.list({ search: query, searchFields: ["name", "company", "email"] });
  }

  count(): number {
    return this.list().length;
  }

  getByClientId(clientId: string): Lead[] {
    return this.list().filter((item) => item.companyId === clientId);
  }

  crmStore() {
    return this.crm;
  }
}

export const leadRepository = new LeadRepository();

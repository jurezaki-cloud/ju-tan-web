import type { Opportunity } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class OpportunityRepository extends CrmRepository<Opportunity> {
  constructor() {
    super("opportunities", appPersistence.repositories.opportunities);
  }
}

export const opportunityRepository = new OpportunityRepository();

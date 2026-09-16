import type { Quote } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class QuoteRepository extends CrmRepository<Quote> {
  constructor() {
    super("quotes", appPersistence.repositories.quotes);
  }
}

export const quoteRepository = new QuoteRepository();

import type { Document } from "@/src/domain/document";
import type { Invoice } from "@/src/domain/invoice";
import type { Offer } from "@/src/domain/offer";
import { store } from "./mock/store";
import { appPersistence } from "@/src/persistence/app";
import type { RepositoryAdapter } from "@/src/types/persistence";

export class DocumentRepository {
  constructor(private readonly records: RepositoryAdapter<Document> = appPersistence.repositories.documents) {}

  list(): Document[] {
    return this.records.list();
  }

  listByClient(clientId: string): Document[] {
    return this.list().filter((item) => item.clientId === clientId);
  }

  listInvoices(): Invoice[] {
    return store.invoices;
  }

  listOffers(): Offer[] {
    return store.offers;
  }
}

export const documentRepository = new DocumentRepository();

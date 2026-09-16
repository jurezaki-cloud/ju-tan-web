import { documentRepository } from "@/src/repositories/DocumentRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Document } from "@/src/domain/document";
import type { Invoice } from "@/src/domain/invoice";
import type { Offer } from "@/src/domain/offer";

export class DocumentService {
  list(): Result<Document[]> {
    try {
      return ok(documentRepository.list());
    } catch {
      return err("Dokumentov ni bilo mogoče naložiti.");
    }
  }

  listByClient(clientId: string): Result<Document[]> {
    try {
      return ok(documentRepository.listByClient(clientId));
    } catch {
      return err("Dokumentov stranke ni bilo mogoče naložiti.");
    }
  }

  listInvoices(): Result<Invoice[]> {
    return ok(documentRepository.listInvoices());
  }

  listOffers(): Result<Offer[]> {
    return ok(documentRepository.listOffers());
  }
}

export const documentService = new DocumentService();

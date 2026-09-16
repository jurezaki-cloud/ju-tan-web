import { documentService } from "@/src/services/DocumentService";
import type { Document } from "@/src/domain/document";
import type { Invoice } from "@/src/domain/invoice";
import type { Offer } from "@/src/domain/offer";
import type { Result } from "@/src/types/platform";

export async function getDocuments(): Promise<Result<Document[]>> {
  return documentService.list();
}

export async function getDocumentsByClient(
  clientId: string,
): Promise<Result<Document[]>> {
  return documentService.listByClient(clientId);
}

export async function getInvoices(): Promise<Result<Invoice[]>> {
  return documentService.listInvoices();
}

export async function getOffers(): Promise<Result<Offer[]>> {
  return documentService.listOffers();
}

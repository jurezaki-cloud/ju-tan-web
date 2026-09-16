import { quoteRepository } from "@/src/repositories/QuoteRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Quote } from "@/src/domain/crm";
import type { CrmListResult, CrmQueryParams, QuoteWrite } from "@/src/types/crm";
import { recordCrmAudit } from "./crmAudit";
import { systemCrmAccess, type CrmAccess } from "./crmAccess";
import { nextCrmId, stampCrm } from "./crmStamp";
import { appPersistence } from "@/src/persistence/app";

export class QuoteService {
  list(params: CrmQueryParams = {}, access: CrmAccess = systemCrmAccess): Result<CrmListResult<Quote>> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    try {
      return ok(quoteRepository.list(params));
    } catch {
      return err("Ponudb ni bilo mogoče naložiti.");
    }
  }

  getById(id: string, access: CrmAccess = systemCrmAccess): Result<Quote> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    const item = quoteRepository.getById(id);
    if (!item) return err("Ponudba ne obstaja.");
    return ok(item);
  }

  getByClientId(clientId: string): Result<Quote[]> {
    return ok(quoteRepository.getByClientId(clientId));
  }

  create(input: QuoteWrite, access: CrmAccess = systemCrmAccess): Result<Quote> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    const title = input.title?.trim() || input.name?.trim();
    if (!title) return err("Naziv ponudbe je obvezen.");
    const artifactId = `art-quote-${Date.now().toString(36)}`;
    const item = stampCrm<Quote>(nextCrmId("qt", quoteRepository.count()), input.status ?? "draft", {
      name: title,
      company: "",
      source: "manual",
      owner: "",
      title,
      number: input.number ?? `P-${Date.now().toString().slice(-6)}`,
      amount: input.amount,
      currency: input.currency ?? "EUR",
      expiresAt: input.expiresAt,
      pdfArtifactId: artifactId,
      clientId: input.clientId,
      opportunityId: input.opportunityId,
      projectId: input.projectId,
    });
    appPersistence.transactions.createQuoteBundle(item, artifactId);
    recordCrmAudit("QuoteCreated", { id: item.id, clientId: item.clientId, artifactId });
    return ok(item);
  }

  draftFromClient(clientId: string, access: CrmAccess = systemCrmAccess): Result<Quote> {
    recordCrmAudit("QuoteDraftPrepared", { clientId });
    return this.create({ title: "Osnutek ponudbe", clientId, amount: "0", currency: "EUR" }, access);
  }

  archive(id: string, access: CrmAccess = systemCrmAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const done = quoteRepository.archive(id);
    if (done) recordCrmAudit("RecordArchived", { id, type: "quote" });
    return ok(done);
  }

  restore(id: string, access: CrmAccess = systemCrmAccess): Result<Quote> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    const item = quoteRepository.restore(id);
    if (!item) return err("Ponudbe ni bilo mogoče obnoviti.");
    recordCrmAudit("RecordRestored", { id, type: "quote" });
    return ok(item);
  }
}

export const quoteService = new QuoteService();

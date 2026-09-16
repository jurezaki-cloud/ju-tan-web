import type { DatabaseAdapter, TenantScope, TransactionHandle } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceTracer } from "../observability";
import { MappedRepository } from "../repositories/MappedRepository";
import { LeadMapper, DocumentMapper, ProjectMapper, AuditMapper, ArtifactMapper } from "../mapping";
import type { Lead } from "@/src/domain/lead";
import type { Project } from "@/src/domain/project";
import type { Document } from "@/src/domain/document";
import type { Contact, Note, Quote } from "@/src/domain/crm";
import type { Offer, OfferDraft, OfferLine, OfferRevision, OfferStatusHistory } from "@/src/domain/offers";
import { CrmEntityMapper } from "../mappers/crm.mapper";

export class TransactionScope {
  constructor(readonly handle: TransactionHandle) {}
}

export class TransactionalRepository<T extends { id: string }> extends MappedRepository<T> {}

export class TransactionManager {
  constructor(
    private readonly adapter: DatabaseAdapter,
    private readonly tables: InMemoryTables,
    private readonly scope: TenantScope,
    private readonly tracer = new PersistenceTracer(),
  ) {}

  run<T>(fn: (scope: TransactionScope) => Promise<T>): Promise<T> {
    return this.adapter.transaction(async (handle) => fn(new TransactionScope(handle)));
  }

  createLeadWithActivity(lead: Lead, activity: { id: string; text: string }) {
    return this.tracer.measure("transaction", "leads", () => {
      const leads = new MappedRepository("leads", this.tables, new LeadMapper(), this.scope);
      leads.save(lead);
      this.tables.insert(
        "activities",
        {
          id: activity.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "open",
          metadata: {},
          tenantId: this.scope.tenantId,
          workspaceId: this.scope.workspaceId ?? "ws-demo",
          organizationId: this.scope.organizationId,
          version: 1,
          data: { text: activity.text, leadId: lead.id },
        },
        this.scope,
      );
      return lead;
    });
  }

  createOfferWithArtifact(document: Document, artifactId: string) {
    const documents = new MappedRepository("documents", this.tables, new DocumentMapper(), this.scope);
    documents.save(document);
    new MappedRepository<{ id: string }>("artifacts", this.tables, new ArtifactMapper(), this.scope).save({
      id: artifactId,
    });
    new MappedRepository<{ id: string }>("audit_events", this.tables, new AuditMapper(), this.scope).save({
      id: `aud-${artifactId}`,
    });
    return { document, artifactId };
  }

  createProjectBundle(project: Project, document: Document, task: { id: string; text: string }) {
    new MappedRepository("projects", this.tables, new ProjectMapper(), this.scope).save(project);
    new MappedRepository("documents", this.tables, new DocumentMapper(), this.scope).save(document);
    this.tables.insert(
      "tasks",
      {
        id: task.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        metadata: {},
        tenantId: this.scope.tenantId,
        workspaceId: this.scope.workspaceId ?? "ws-demo",
        organizationId: this.scope.organizationId,
        version: 1,
        data: { text: task.text, projectId: project.id },
      },
      this.scope,
    );
    return project;
  }

  loginSession(session: { id: string; userId: string; token: string }) {
    this.tables.insert(
      "sessions",
      {
        id: session.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
        metadata: {},
        tenantId: this.scope.tenantId,
        workspaceId: this.scope.workspaceId ?? "ws-demo",
        ownerId: session.userId,
        organizationId: this.scope.organizationId,
        version: 1,
        data: { ...session },
      },
      this.scope,
    );
    return session;
  }

  createQuoteBundle(quote: Quote, artifactId: string) {
    return this.tracer.measure("transaction", "quotes", () => {
      new MappedRepository("quotes", this.tables, new CrmEntityMapper<Quote>(), this.scope).save(quote);
      new MappedRepository<{ id: string }>("artifacts", this.tables, new ArtifactMapper(), this.scope).save({
        id: artifactId,
      });
      new MappedRepository<{ id: string }>("audit_events", this.tables, new AuditMapper(), this.scope).save({
        id: `aud-${quote.id}`,
      });
      return quote;
    });
  }

  createClientBundle(clientId: string, contact: Contact, note: Note) {
    return this.tracer.measure("transaction", "clients", () => {
      new MappedRepository("contacts", this.tables, new CrmEntityMapper<Contact>(), this.scope).save(contact);
      new MappedRepository("notes", this.tables, new CrmEntityMapper<Note>(), this.scope).save(note);
      new MappedRepository<{ id: string }>("audit_events", this.tables, new AuditMapper(), this.scope).save({
        id: `aud-client-${clientId}`,
      });
      return { clientId, contact, note };
    });
  }

  createOfferDraftBundle(offer: Offer, draft: OfferDraft, lines: OfferLine[], history: OfferStatusHistory) {
    return this.tracer.measure("transaction", "offers", () => {
      new MappedRepository("offers", this.tables, new CrmEntityMapper<Offer>(), this.scope).save(offer);
      new MappedRepository("offer_drafts", this.tables, new CrmEntityMapper<OfferDraft>(), this.scope).save(draft);
      const lineRepo = new MappedRepository("offer_lines", this.tables, new CrmEntityMapper<OfferLine>(), this.scope);
      lines.forEach((line) => lineRepo.save(line));
      new MappedRepository("offer_status_history", this.tables, new CrmEntityMapper<OfferStatusHistory>(), this.scope).save(history);
      new MappedRepository<{ id: string }>("audit_events", this.tables, new AuditMapper(), this.scope).save({
        id: `aud-off-${offer.id}`,
      });
      return offer;
    });
  }

  createOfferRevisionBundle(offer: Offer, revision: OfferRevision) {
    return this.tracer.measure("transaction", "offer_revisions", () => {
      new MappedRepository("offers", this.tables, new CrmEntityMapper<Offer>(), this.scope).save(offer);
      new MappedRepository("offer_revisions", this.tables, new CrmEntityMapper<OfferRevision>(), this.scope).save(revision);
      return revision;
    });
  }

  createOfferPdfBundle(offer: Offer, artifactId: string, document: Document) {
    return this.tracer.measure("transaction", "offers", () => {
      new MappedRepository("offers", this.tables, new CrmEntityMapper<Offer>(), this.scope).save(offer);
      new MappedRepository<{ id: string }>("artifacts", this.tables, new ArtifactMapper(), this.scope).save({
        id: artifactId,
      });
      new MappedRepository("documents", this.tables, new DocumentMapper(), this.scope).save(document);
      new MappedRepository<{ id: string }>("audit_events", this.tables, new AuditMapper(), this.scope).save({
        id: `aud-pdf-${offer.id}`,
      });
      return { offer, artifactId, document };
    });
  }

  sendOfferWithAudit(offer: Offer) {
    return this.tracer.measure("transaction", "offers", () => {
      new MappedRepository("offers", this.tables, new CrmEntityMapper<Offer>(), this.scope).save(offer);
      new MappedRepository<{ id: string }>("audit_events", this.tables, new AuditMapper(), this.scope).save({
        id: `aud-send-${offer.id}`,
      });
      return offer;
    });
  }

  archiveOfferWithAudit(id: string) {
    return this.archiveWithAudit("offers", id);
  }

  archiveWithAudit(table: "clients" | "documents" | "projects" | "leads" | "quotes" | "tasks" | "offers", id: string) {
    return this.tracer.measure("transaction", table, () => {
      this.tables.archive(table, id, this.scope);
      new MappedRepository<{ id: string }>("audit_events", this.tables, new AuditMapper(), this.scope).save({
        id: `aud-arch-${id}`,
      });
      return true;
    });
  }

  archiveFlow(table: "clients" | "documents" | "projects" | "leads", id: string) {
    this.archiveWithAudit(table, id);
  }
}

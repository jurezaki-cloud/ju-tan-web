import { noteRepository } from "@/src/repositories/NoteRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Note } from "@/src/domain/crm";
import type { CrmListResult, CrmQueryParams, NoteWrite } from "@/src/types/crm";
import { recordCrmAudit } from "./crmAudit";
import { systemCrmAccess, type CrmAccess } from "./crmAccess";
import { nextCrmId, stampCrm } from "./crmStamp";

export class NoteService {
  list(params: CrmQueryParams = {}, access: CrmAccess = systemCrmAccess): Result<CrmListResult<Note>> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    try {
      return ok(noteRepository.list(params));
    } catch {
      return err("Opomb ni bilo mogoče naložiti.");
    }
  }

  getByClientId(clientId: string): Result<Note[]> {
    return ok(noteRepository.getByClientId(clientId));
  }

  create(input: NoteWrite, access: CrmAccess = systemCrmAccess): Result<Note> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    if (!input.body.trim()) return err("Besedilo opombe je obvezno.");
    const item = stampCrm<Note>(nextCrmId("nt", noteRepository.count()), input.status ?? "active", {
      body: input.body.trim(),
      pinned: Boolean(input.pinned),
      clientId: input.clientId,
      leadId: input.leadId,
      opportunityId: input.opportunityId,
      name: input.body.trim().slice(0, 48),
    });
    noteRepository.create(item);
    recordCrmAudit("NoteCreated", { id: item.id, clientId: item.clientId });
    return ok(item);
  }

  archive(id: string, access: CrmAccess = systemCrmAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const done = noteRepository.archive(id);
    if (done) recordCrmAudit("RecordArchived", { id, type: "note" });
    return ok(done);
  }

  restore(id: string, access: CrmAccess = systemCrmAccess): Result<Note> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    const item = noteRepository.restore(id);
    if (!item) return err("Opombe ni bilo mogoče obnoviti.");
    recordCrmAudit("RecordRestored", { id, type: "note" });
    return ok(item);
  }
}

export const noteService = new NoteService();

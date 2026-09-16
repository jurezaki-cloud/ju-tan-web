import type { Note } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class NoteRepository extends CrmRepository<Note> {
  constructor() {
    super("notes", appPersistence.repositories.notes);
  }
}

export const noteRepository = new NoteRepository();

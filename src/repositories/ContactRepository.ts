import type { Contact } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class ContactRepository extends CrmRepository<Contact> {
  constructor() {
    super("contacts", appPersistence.repositories.contacts);
  }
}

export const contactRepository = new ContactRepository();

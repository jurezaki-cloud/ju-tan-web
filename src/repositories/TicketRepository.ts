import type { Ticket } from "@/src/domain/ticket";
import { appPersistence } from "@/src/persistence/app";
import type { RepositoryAdapter } from "@/src/types/persistence";

export class TicketRepository {
  constructor(private readonly records: RepositoryAdapter<Ticket> = appPersistence.repositories.tickets) {}

  list(): Ticket[] {
    return this.records.list();
  }

  getById(id: string): Ticket | undefined {
    return this.records.getById(id);
  }
}

export const ticketRepository = new TicketRepository();

import { ticketRepository } from "@/src/repositories/TicketRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Ticket } from "@/src/domain/ticket";

export class TicketService {
  list(): Result<Ticket[]> {
    try {
      return ok(ticketRepository.list());
    } catch {
      return err("Ticketov ni bilo mogoče naložiti.");
    }
  }
}

export const ticketService = new TicketService();

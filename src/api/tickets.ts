import { ticketService } from "@/src/services/TicketService";
import type { Ticket } from "@/src/domain/ticket";
import type { Result } from "@/src/types/platform";

export async function getTickets(): Promise<Result<Ticket[]>> {
  return ticketService.list();
}

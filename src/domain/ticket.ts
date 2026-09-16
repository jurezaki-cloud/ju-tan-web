import type { Priority } from "./project";

export type TicketStatus = "Open" | "In progress" | "Resolved";

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  status: TicketStatus;
  priority: Priority;
  updated: string;
}

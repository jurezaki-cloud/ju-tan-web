import { clientService } from "@/src/services/ClientService";
import type { Client } from "@/src/domain/client";
import type { Result } from "@/src/types/platform";

export async function getClients(): Promise<Result<Client[]>> {
  return clientService.list();
}

export async function getClient(id: string): Promise<Result<Client>> {
  return clientService.getById(id);
}

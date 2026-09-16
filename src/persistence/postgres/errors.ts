export { TenantIsolationError, QueryError, ConcurrencyError, ValidationError, PersistenceError } from "../errors";

export class PostgresUnavailableError extends Error {
  constructor(message = "PostgreSQL driver ni na voljo.") {
    super(message);
    this.name = "PostgresUnavailableError";
  }
}

export function classifyDbError(error: unknown): { code: string; retryable: boolean; message: string } {
  const message = error instanceof Error ? error.message : "Neznana napaka baze.";
  if (message.includes("TENANT")) return { code: "TENANT", retryable: false, message };
  if (message.includes("CONCURRENCY") || message.includes("version")) return { code: "CONCURRENCY", retryable: true, message };
  if (message.toLowerCase().includes("timeout")) return { code: "TIMEOUT", retryable: true, message };
  return { code: "DB", retryable: false, message };
}

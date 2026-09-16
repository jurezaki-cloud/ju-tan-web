export class PersistenceError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly retryable = false,
  ) {
    super(message);
    this.name = "PersistenceError";
  }
}

export class TenantIsolationError extends PersistenceError {
  constructor(message = "Dostop do podatkov druge organizacije ni dovoljen.") {
    super(message, "TENANT_ISOLATION");
    this.name = "TenantIsolationError";
  }
}

export class ConcurrencyError extends PersistenceError {
  constructor(message = "Zapis je bil vmes spremenjen.") {
    super(message, "CONCURRENCY", true);
    this.name = "ConcurrencyError";
  }
}

export class QueryError extends PersistenceError {
  constructor(message: string) {
    super(message, "QUERY");
    this.name = "QueryError";
  }
}

export class ValidationError extends PersistenceError {
  constructor(message: string) {
    super(message, "VALIDATION");
    this.name = "ValidationError";
  }
}

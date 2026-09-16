export type SqlParam = string | number | boolean | null | Date;

export type DbRow = Record<string, unknown>;

export type DbTable = string;

export type DbColumn = string;

export type QuerySpec = {
  table: DbTable;
  op: "select" | "insert" | "update" | "soft-delete" | "count" | "exists";
  columns?: DbColumn[];
  filters?: Record<string, SqlParam | undefined>;
  data?: Record<string, unknown>;
  orderBy?: { column: DbColumn; direction: "asc" | "desc" };
  limit?: number;
  offset?: number;
  joins?: { table: DbTable; on: string }[];
  includeDeleted?: boolean;
  expectedVersion?: number;
};

export type SqlStatement = {
  text: string;
  params: SqlParam[];
  spec: QuerySpec;
};

export type PostgresQueryResult = {
  rows: DbRow[];
  rowCount: number;
  durationMs: number;
};

export type RepositoryResult<T> = {
  item?: T;
  items?: T[];
  rowCount: number;
};

export interface PostgresTransaction {
  readonly id: string;
  query(statement: SqlStatement): Promise<PostgresQueryResult>;
  command(statement: SqlStatement): Promise<PostgresQueryResult>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  savepoint(name: string): Promise<void>;
  rollbackTo(name: string): Promise<void>;
}

export interface PostgresDriver {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  ping(): Promise<boolean>;
  query(statement: SqlStatement): Promise<PostgresQueryResult>;
  command(statement: SqlStatement): Promise<PostgresQueryResult>;
  transaction<T>(fn: (tx: PostgresTransaction) => Promise<T>): Promise<T>;
  execute(sql: string, params?: SqlParam[]): Promise<PostgresQueryResult>;
}

export type PostgresConfig = {
  databaseUrl?: string;
  tenantId: string;
  workspaceId: string;
  organizationId: string;
  poolSize: number;
  ssl: boolean;
  schema: string;
  readOnly: boolean;
  timeoutMs: number;
};

export type PostgresClientHandle = {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  ping(): Promise<boolean>;
  query(text: string, params?: SqlParam[]): Promise<PostgresQueryResult>;
  command(text: string, params?: SqlParam[]): Promise<PostgresQueryResult>;
  transaction<T>(fn: (tx: PostgresTransaction) => Promise<T>): Promise<T>;
  readonly live: boolean;
  readonly kind: "live" | "compatible";
};

export type BootstrapResult<TPersistence = unknown> = {
  persistence: TPersistence;
  handle: PostgresClientHandle;
  readiness: import("./persistence").ReadinessState;
  health: import("./persistence").HealthState;
  fallback?: string;
  seed: import("./persistence").SeedStatus[];
};

export type { PostgresConnectionConfig, PoolConfig, HealthState, ReadinessState, SeedStatus, MigrationStatus } from "./persistence";

export type MigrationStep = {
  id: string;
  name: string;
  sql?: string;
  downSql?: string;
  up?(driver: PostgresDriver): Promise<void>;
  down?(driver: PostgresDriver): Promise<void>;
};

export type MigrationResult = {
  id: string;
  name: string;
  applied: boolean;
  appliedAt?: string;
  durationMs?: number;
  error?: string;
};

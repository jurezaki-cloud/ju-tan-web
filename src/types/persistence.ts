export type PersistenceMode = "mock" | "postgres";

export type TenantScope = {
  tenantId: string;
  organizationId: string;
  workspaceId?: string;
};

export type QueryOptions = {
  filter?: Record<string, unknown>;
  search?: string;
  searchFields?: string[];
  sort?: { field: string; direction: "asc" | "desc" };
  page?: number;
  pageSize?: number;
  includeDeleted?: boolean;
  relations?: string[];
  indexHint?: string;
};

export type PaginationResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type PersistenceQuery = {
  table: string;
  op: "select";
  filters?: Record<string, unknown>;
  options?: QueryOptions;
  sql?: string;
  params?: unknown[];
};

export type PersistenceCommand = {
  table: string;
  op: "insert" | "update" | "delete" | "archive";
  id?: string;
  row?: PersistenceRecord;
  patch?: Partial<PersistenceRecord>;
  expectedVersion?: number;
  sql?: string;
  params?: unknown[];
};

export type QueryResult<T = PersistenceRecord> = {
  rows: T[];
  rowCount: number;
  durationMs: number;
};

export type TransactionHandle = {
  id: string;
  query(command: PersistenceQuery): Promise<QueryResult>;
  command(command: PersistenceCommand): Promise<QueryResult>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
};

export type PersistenceRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  workspaceId: string;
  ownerId?: string;
  organizationId: string;
  deletedAt?: string | null;
  version: number;
  data: Record<string, unknown>;
};

export interface DatabaseAdapter {
  readonly mode: PersistenceMode;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  ping(): Promise<boolean>;
  transaction<T>(fn: (tx: TransactionHandle) => Promise<T>): Promise<T>;
  query(command: PersistenceQuery): Promise<QueryResult>;
  command(command: PersistenceCommand): Promise<QueryResult>;
}

export interface RepositoryAdapter<T> {
  list(options?: QueryOptions): T[];
  getById(id: string): T | undefined;
  getByIds(ids: string[]): T[];
  save(entity: T): T;
  archive(id: string): boolean;
  delete(id: string): boolean;
}

export type SeedContext = {
  tenant: TenantScope;
  now: () => Date;
};

export type Migration = {
  id: string;
  name: string;
  up(adapter: DatabaseAdapter): Promise<void>;
  down?(adapter: DatabaseAdapter): Promise<void>;
};

export type MigrationStatus = {
  id: string;
  name: string;
  applied: boolean;
  appliedAt?: string;
};

export type PersistenceConfig = {
  mode: PersistenceMode;
  tenant: TenantScope;
  connectionString?: string;
  databaseUrl?: string;
  tenantId?: string;
  workspaceId?: string;
  organizationId?: string;
  driver?: import("./postgres").PostgresDriver;
  liveHandle?: import("./postgres").PostgresClientHandle;
  seed?: boolean;
  poolSize?: number;
  ssl?: boolean;
  schema?: string;
  readOnly?: boolean;
  timeoutMs?: number;
};


export interface RepositoryCache {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  invalidate(prefix: string): void;
}

export type PersistenceTrace = {
  kind: "query" | "command" | "transaction" | "repository" | "connection" | "migration" | "seed" | "fallback" | "readiness";
  table?: string;
  durationMs: number;
  slow: boolean;
  error?: string;
};

export type ReadinessState = "ready" | "degraded" | "fallback" | "maintenance";

export type HealthState = {
  ok: boolean;
  status: ReadinessState;
  latencyMs: number;
  driver: "live" | "compatible" | "mock";
  migrations: boolean;
  seed: boolean;
  available: boolean;
};

export type SeedStatus = {
  id: string;
  applied: boolean;
  appliedAt?: string;
};

export type PoolConfig = {
  max: number;
  ssl: boolean;
  idleTimeoutMs: number;
};

export type PostgresConnectionConfig = {
  mode: PersistenceMode;
  databaseUrl?: string;
  poolSize: number;
  ssl: boolean;
  schema: string;
  readOnly: boolean;
  timeoutMs: number;
  tenantId: string;
  workspaceId: string;
  organizationId: string;
};


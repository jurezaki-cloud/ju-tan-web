import type { PersistenceConfig, PersistenceMode, TenantScope } from "@/src/types/persistence";
import { defaultTenant } from "./entities";
import { InMemoryTables } from "./db/InMemoryTables";
import { MockDatabaseAdapter } from "./adapters/MockAdapter";
import { PostgresAdapter } from "./adapters/PostgresAdapter";
import { PersistenceEvents, PersistenceTracer } from "./observability";
import { PersistencePolicy, InMemoryRepositoryCache } from "./security";
import { CompatiblePostgresDriver } from "./postgres/driver";
import { PostgresClient } from "./postgres/client";
import { tryCreateNativeHandle } from "./postgres/connection";
import { createPostgresClientHandle } from "./postgres/client-handle";
import { resolvePostgresConfig } from "./postgres/config";
import { resolvePersistenceMode } from "./bootstrap/resolve";
import { bindRepositories } from "./wiring/bindRepositories";
import { bindTransactionManager } from "./wiring/bindTransactionManager";
import { bindQueryLayer } from "./wiring/bindQueryLayer";
import { bindSeedRunner } from "./wiring/bindSeedRunner";
import { bindMigrations } from "./wiring/bindMigrations";
import { syncPlatformStore } from "./seed";
import type { PostgresClientHandle } from "@/src/types/postgres";

export function loadPersistenceConfig(): PersistenceConfig {
  const pg = resolvePostgresConfig();
  return {
    mode: pg.mode,
    tenant: { tenantId: pg.tenantId, organizationId: pg.organizationId, workspaceId: pg.workspaceId },
    connectionString: pg.databaseUrl,
    databaseUrl: pg.databaseUrl,
    tenantId: pg.tenantId,
    workspaceId: pg.workspaceId,
    organizationId: pg.organizationId,
    seed: true,
    poolSize: pg.poolSize,
    ssl: pg.ssl,
    schema: pg.schema,
    readOnly: pg.readOnly,
    timeoutMs: pg.timeoutMs,
  };
}

function resolveTenant(config: PersistenceConfig): TenantScope {
  return {
    tenantId: config.tenantId ?? config.tenant.tenantId,
    organizationId: config.organizationId ?? config.tenant.organizationId,
    workspaceId: config.workspaceId ?? config.tenant.workspaceId ?? defaultTenant.workspaceId,
  };
}

export function createPersistence(config: PersistenceConfig) {
  const tenant = resolveTenant(config);
  const tracer = new PersistenceTracer();
  const events = new PersistenceEvents();
  const policy = new PersistencePolicy();
  policy.assertScope(tenant);
  const cache = new InMemoryRepositoryCache();
  const tables = new InMemoryTables();
  const pgConfig = resolvePostgresConfig({
    mode: config.mode,
    databaseUrl: config.databaseUrl,
    poolSize: config.poolSize,
    ssl: config.ssl,
    schema: config.schema,
    readOnly: config.readOnly,
    timeoutMs: config.timeoutMs,
    tenantId: tenant.tenantId,
    workspaceId: tenant.workspaceId,
    organizationId: tenant.organizationId,
  });
  const nativeHandle = tryCreateNativeHandle(pgConfig);
  const native = nativeHandle ? new PostgresClient(pgConfig.databaseUrl, nativeHandle) : undefined;
  const pgDriver =
    config.driver instanceof CompatiblePostgresDriver
      ? config.driver
      : new CompatiblePostgresDriver(tables, tenant, tracer, native);
  const resolved = resolvePersistenceMode({
    mode: config.mode,
    databaseUrl: config.databaseUrl,
    hasDriver: Boolean(config.driver),
    nativeLive: Boolean(native?.live || config.liveHandle),
  });
  if (resolved.fallback) {
    events.fallback(resolved.fallback);
    tracer.measure("fallback", undefined, () => resolved.fallback);
  }
  const adapter =
    resolved.mode === "postgres" ? new PostgresAdapter(pgDriver) : new MockDatabaseAdapter(tables, tenant, tracer);
  const { seed, pipeline } = bindSeedRunner(tables, tenant, tracer, events);
  const sync = () => syncPlatformStore(tables, tenant);
  const seedStatus = config.seed !== false ? pipeline.run({ tenant, now: () => new Date() }) : pipeline.status();
  sync();

  const repositories = bindRepositories({
    usePostgres: resolved.mode === "postgres",
    tables,
    tenant,
    pgDriver,
    tracer,
    policy,
    cache,
    sync,
  });
  const transactions = bindTransactionManager(adapter, tables, tenant, tracer);
  const { migrations, postgresMigrations } = bindMigrations(adapter, pgDriver, tracer, events, seed);
  if (!pgDriver.physical) {
    for (const step of postgresMigrations.list()) {
      postgresMigrations.markApplied(step.id, step.name);
    }
  }
  const queries = bindQueryLayer(tables, tenant);
  const handle: PostgresClientHandle = config.liveHandle ?? createPostgresClientHandle(pgDriver, pgConfig, native, events);

  async function start() {
    await adapter.connect();
    await handle.connect();
    if (resolved.mode === "postgres") await postgresMigrations.run();
    else await migrations.run();
    events.emit("audit", "bootstrap", { mode: resolved.mode, fallback: resolved.fallback ?? "" });
  }

  void start();

  return {
    adapter,
    tables,
    tracer,
    events,
    policy,
    cache,
    tenant,
    mode: resolved.mode as PersistenceMode,
    fallback: resolved.fallback,
    driver: pgDriver,
    handle,
    repositories,
    transactions,
    seed,
    seedPipeline: pipeline,
    seedStatus,
    migrations,
    postgresMigrations,
    queries,
    start,
  };
}

export type PersistenceBundle = ReturnType<typeof createPersistence>;

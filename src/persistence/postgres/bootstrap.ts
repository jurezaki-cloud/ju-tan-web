import type { PostgresConnectionConfig } from "@/src/types/persistence";
import type { PostgresClientHandle } from "@/src/types/postgres";
import { CompatiblePostgresDriver } from "./driver";
import { PostgresClient } from "./client";
import { createMockCompatibleHandle, createPostgresClientHandle } from "./client-handle";
import { tryCreateNativeHandle } from "./connection";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceTracer, PersistenceEvents } from "../observability";
import { defaultTenant } from "../entities";

export function createPostgresHandleBootstrap(
  config: PostgresConnectionConfig,
  tables = new InMemoryTables(),
  tracer = new PersistenceTracer(),
  events = new PersistenceEvents(),
  injected?: PostgresClientHandle,
): { handle: PostgresClientHandle; driver: CompatiblePostgresDriver; native?: PostgresClient; fallback?: string } {
  const nativeHandle = injected ? undefined : tryCreateNativeHandle(config);
  const native = nativeHandle ? new PostgresClient(config.databaseUrl, nativeHandle) : undefined;
  const driver = new CompatiblePostgresDriver(tables, {
    tenantId: config.tenantId,
    organizationId: config.organizationId,
    workspaceId: config.workspaceId || defaultTenant.workspaceId,
  }, tracer, native);
  if (injected) {
    return { handle: injected, driver };
  }
  if (config.mode === "postgres" && native?.live) {
    return { handle: createPostgresClientHandle(driver, config, native, events), driver, native };
  }
  const fallback =
    config.mode === "postgres" ? (config.databaseUrl ? "native-driver-unavailable" : "database-url-missing") : undefined;
  return {
    handle: createMockCompatibleHandle(driver, config, events),
    driver,
    fallback,
  };
}

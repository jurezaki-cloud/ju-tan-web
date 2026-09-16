import type { PersistenceMode, PostgresConnectionConfig } from "@/src/types/persistence";
import type { PostgresConfig } from "@/src/types/postgres";
import { defaultTenant } from "../entities";

function parseBool(value: string | undefined, fallback = false): boolean {
  if (value == null || value === "") return fallback;
  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}

function parseIntEnv(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function redactConnectionString(url?: string): string | undefined {
  if (!url) return undefined;
  return url.replace(/:([^:@/]+)@/, ":***@");
}

export function validatePostgresConfig(config: PostgresConnectionConfig): { ok: boolean; reason?: string } {
  if (config.mode !== "postgres" && config.mode !== "mock") {
    return { ok: false, reason: "invalid-mode" };
  }
  if (config.timeoutMs < 100 || config.timeoutMs > 120_000) {
    return { ok: false, reason: "invalid-timeout" };
  }
  if (config.poolSize < 1 || config.poolSize > 100) {
    return { ok: false, reason: "invalid-pool-size" };
  }
  if (config.mode === "postgres" && !config.databaseUrl) {
    return { ok: false, reason: "database-url-missing" };
  }
  if (config.databaseUrl && !/^postgres(ql)?:\/\//i.test(config.databaseUrl)) {
    return { ok: false, reason: "invalid-database-url" };
  }
  if (!config.organizationId || !config.tenantId) {
    return { ok: false, reason: "tenant-scope-missing" };
  }
  if (!/^[a-z_][a-z0-9_]*$/.test(config.schema)) {
    return { ok: false, reason: "invalid-schema" };
  }
  return { ok: true };
}

export function resolvePostgresConfig(overrides: Partial<PostgresConnectionConfig> = {}): PostgresConnectionConfig {
  const mode: PersistenceMode = overrides.mode ?? (process.env.PERSISTENCE_MODE === "postgres" ? "postgres" : "mock");
  return {
    mode,
    databaseUrl: overrides.databaseUrl ?? process.env.DATABASE_URL,
    poolSize: overrides.poolSize ?? parseIntEnv(process.env.POSTGRES_POOL_SIZE, 5),
    ssl: overrides.ssl ?? parseBool(process.env.POSTGRES_SSL, false),
    schema: overrides.schema ?? process.env.POSTGRES_SCHEMA ?? "public",
    readOnly: overrides.readOnly ?? parseBool(process.env.POSTGRES_READ_ONLY, false),
    timeoutMs: overrides.timeoutMs ?? parseIntEnv(process.env.POSTGRES_TIMEOUT_MS, 5000),
    tenantId: overrides.tenantId ?? process.env.PERSISTENCE_TENANT_ID ?? defaultTenant.tenantId,
    workspaceId: overrides.workspaceId ?? process.env.PERSISTENCE_WORKSPACE_ID ?? defaultTenant.workspaceId,
    organizationId: overrides.organizationId ?? process.env.PERSISTENCE_ORG_ID ?? defaultTenant.organizationId,
  };
}

export function loadPostgresConfig(): PostgresConfig {
  const resolved = resolvePostgresConfig();
  return {
    databaseUrl: resolved.databaseUrl,
    tenantId: resolved.tenantId,
    workspaceId: resolved.workspaceId,
    organizationId: resolved.organizationId,
    poolSize: resolved.poolSize,
    ssl: resolved.ssl,
    schema: resolved.schema,
    readOnly: resolved.readOnly,
    timeoutMs: resolved.timeoutMs,
  };
}

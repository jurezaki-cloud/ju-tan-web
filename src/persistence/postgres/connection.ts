import type { PostgresConnectionConfig } from "@/src/types/persistence";
import type { LiveQueryHandle } from "./types";
import { toPoolConfig } from "./pool";
import { validatePostgresConfig } from "./config";

type PgPoolLike = {
  query(text: string, params?: unknown[]): Promise<{ rows: Record<string, unknown>[]; rowCount?: number }>;
  end(): Promise<void>;
  connect?(): Promise<{ release(): void }>;
};

function loadOptionalPg(): { Pool?: new (opts: Record<string, unknown>) => PgPoolLike } | undefined {
  try {
    const load = Function("n", "try { return require(n); } catch (e) { return undefined; }") as (n: string) =>
      | { Pool?: new (opts: Record<string, unknown>) => PgPoolLike }
      | undefined;
    return load("pg");
  } catch {
    return undefined;
  }
}

export function tryCreateNativeHandle(config: PostgresConnectionConfig): LiveQueryHandle | undefined {
  if (!config.databaseUrl) return undefined;
  const valid = validatePostgresConfig({ ...config, mode: "postgres" });
  if (!valid.ok) return undefined;
  const mod = loadOptionalPg();
  if (!mod?.Pool) return undefined;
  const poolCfg = toPoolConfig(config);
  const pool = new mod.Pool({
    connectionString: config.databaseUrl,
    max: poolCfg.max,
    ssl: poolCfg.ssl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: config.timeoutMs,
    idleTimeoutMillis: poolCfg.idleTimeoutMs,
    statement_timeout: config.timeoutMs,
  });
  return {
    query: (text, params) => pool.query(text, params),
    connect: async () => {
      await pool.query("SELECT 1");
    },
    end: () => pool.end(),
  };
}

export async function connectWithTimeout(handle: LiveQueryHandle, timeoutMs: number): Promise<void> {
  const work = handle.connect ? handle.connect() : handle.query("SELECT 1", []).then(() => undefined);
  await Promise.race([
    work,
    new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("connection-timeout")), timeoutMs);
    }),
  ]);
}

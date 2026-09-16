import type { PersistenceMode } from "@/src/types/persistence";
import { resolvePostgresConfig } from "../postgres/config";

export { resolvePostgresConfig };

export function resolvePersistenceMode(input: {
  mode: PersistenceMode;
  databaseUrl?: string;
  hasDriver?: boolean;
  nativeLive?: boolean;
}): { mode: PersistenceMode; fallback?: string } {
  if (input.mode !== "postgres") return { mode: "mock" };
  if (input.nativeLive || input.hasDriver) return { mode: "postgres" };
  if (!input.databaseUrl) return { mode: "mock", fallback: "database-url-missing" };
  return { mode: "mock", fallback: "native-driver-unavailable" };
}

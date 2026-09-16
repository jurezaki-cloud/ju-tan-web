import type { DatabaseAdapter, TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceTracer } from "../observability";
import { TransactionManager } from "../transactions";

export function bindTransactionManager(
  adapter: DatabaseAdapter,
  tables: InMemoryTables,
  tenant: TenantScope,
  tracer: PersistenceTracer,
): TransactionManager {
  return new TransactionManager(adapter, tables, tenant, tracer);
}

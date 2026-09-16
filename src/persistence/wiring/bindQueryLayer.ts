import type { TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { QueryLayer } from "../query";

export function bindQueryLayer(tables: InMemoryTables, tenant: TenantScope): QueryLayer {
  return new QueryLayer(tables, tenant);
}

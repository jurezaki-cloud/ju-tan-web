import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";

export type RecordMapper<T> = {
  toDomain(row: PersistenceRecord): T;
  toRecord(item: T, scope?: TenantScope): PersistenceRecord;
};

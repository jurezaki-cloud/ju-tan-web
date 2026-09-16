import type { CrmEntity } from "@/src/domain/crm";
import type { DbRow } from "@/src/types/postgres";
import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import { CrmEntityMapper } from "./crm.mapper";
import { PostgresRowMapper } from "../postgres/mapper";

export class PgCrmMapper<T extends CrmEntity> {
  private readonly domain = new CrmEntityMapper<T>();
  private readonly rows = new PostgresRowMapper();

  toDomain(record: PersistenceRecord): T {
    return this.domain.toDomain(record);
  }

  toRecord(item: T, scope?: TenantScope): PersistenceRecord {
    return this.domain.toRecord(item, scope);
  }

  fromRow(row: DbRow, scope?: TenantScope): T {
    return this.domain.toDomain(this.rows.toRecord(row, scope));
  }
}

import type { Client } from "@/src/domain/client";
import type { DbRow } from "@/src/types/postgres";
import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import { ClientMapper as DomainMapper } from "../mapping";
import { PostgresRowMapper } from "../postgres/mapper";

export class ClientMapper {
  private readonly domain = new DomainMapper();
  private readonly rows = new PostgresRowMapper();

  toDomain(record: PersistenceRecord): Client {
    return this.domain.toDomain(record);
  }

  toRecord(item: Client, scope?: TenantScope): PersistenceRecord {
    return this.domain.toRecord(item, scope);
  }

  fromRow(row: DbRow, scope?: TenantScope): Client {
    return this.domain.toDomain(this.rows.toRecord(row, scope));
  }

  toInsert(item: Client, scope: TenantScope): DbRow {
    return this.rows.fromRecord(this.domain.toRecord(item, scope));
  }
}

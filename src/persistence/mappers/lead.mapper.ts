import type { Lead } from "@/src/domain/lead";
import type { DbRow } from "@/src/types/postgres";
import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import { LeadMapper as DomainMapper } from "../mapping";
import { PostgresRowMapper } from "../postgres/mapper";

export class LeadMapper {
  private readonly domain = new DomainMapper();
  private readonly rows = new PostgresRowMapper();

  toDomain(record: PersistenceRecord): Lead {
    return this.domain.toDomain(record);
  }

  toRecord(item: Lead, scope?: TenantScope): PersistenceRecord {
    return this.domain.toRecord(item, scope);
  }

  fromRow(row: DbRow, scope?: TenantScope): Lead {
    return this.domain.toDomain(this.rows.toRecord(row, scope));
  }

  toInsert(item: Lead, scope: TenantScope): DbRow {
    return this.rows.fromRecord(this.domain.toRecord(item, scope));
  }
}

import type { Document } from "@/src/domain/document";
import type { DbRow } from "@/src/types/postgres";
import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import { DocumentMapper as DomainMapper } from "../mapping";
import { PostgresRowMapper } from "../postgres/mapper";

export class DocumentMapper {
  private readonly domain = new DomainMapper();
  private readonly rows = new PostgresRowMapper();

  toDomain(record: PersistenceRecord): Document {
    return this.domain.toDomain(record);
  }

  toRecord(item: Document, scope?: TenantScope): PersistenceRecord {
    return this.domain.toRecord(item, scope);
  }

  fromRow(row: DbRow, scope?: TenantScope): Document {
    return this.domain.toDomain(this.rows.toRecord(row, scope));
  }

  toInsert(item: Document, scope: TenantScope): DbRow {
    return this.rows.fromRecord(this.domain.toRecord(item, scope));
  }
}

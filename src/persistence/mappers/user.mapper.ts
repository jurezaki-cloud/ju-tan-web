import type { User } from "@/src/domain/user";
import type { DbRow } from "@/src/types/postgres";
import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import { UserMapper as DomainMapper } from "../mapping";
import { PostgresRowMapper } from "../postgres/mapper";

export class UserMapper {
  private readonly domain = new DomainMapper();
  private readonly rows = new PostgresRowMapper();

  toDomain(record: PersistenceRecord): User {
    return this.domain.toDomain(record);
  }

  toRecord(item: User, scope?: TenantScope): PersistenceRecord {
    return this.domain.toRecord(item, scope);
  }

  fromRow(row: DbRow, scope?: TenantScope): User {
    return this.domain.toDomain(this.rows.toRecord(row, scope));
  }

  toInsert(item: User, scope: TenantScope): DbRow {
    return this.rows.fromRecord(this.domain.toRecord(item, scope));
  }
}

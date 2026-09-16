import type { Project } from "@/src/domain/project";
import type { DbRow } from "@/src/types/postgres";
import type { PersistenceRecord, TenantScope } from "@/src/types/persistence";
import { ProjectMapper as DomainMapper } from "../mapping";
import { PostgresRowMapper } from "../postgres/mapper";

export class ProjectMapper {
  private readonly domain = new DomainMapper();
  private readonly rows = new PostgresRowMapper();

  toDomain(record: PersistenceRecord): Project {
    return this.domain.toDomain(record);
  }

  toRecord(item: Project, scope?: TenantScope): PersistenceRecord {
    return this.domain.toRecord(item, scope);
  }

  fromRow(row: DbRow, scope?: TenantScope): Project {
    return this.domain.toDomain(this.rows.toRecord(row, scope));
  }

  toInsert(item: Project, scope: TenantScope): DbRow {
    return this.rows.fromRecord(this.domain.toRecord(item, scope));
  }
}

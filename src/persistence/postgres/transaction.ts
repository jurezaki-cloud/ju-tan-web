import type { PostgresDriver, PostgresQueryResult, PostgresTransaction, SqlStatement } from "@/src/types/postgres";
import { InMemoryTables } from "../db/InMemoryTables";

export class PostgresTx implements PostgresTransaction {
  constructor(
    readonly id: string,
    private readonly driver: Pick<PostgresDriver, "query" | "command" | "execute">,
    private readonly tables?: InMemoryTables,
    private snapshot?: Map<string, import("@/src/types/persistence").PersistenceRecord[]>,
  ) {
    if (tables) this.snapshot = tables.snapshot();
  }

  query(statement: SqlStatement): Promise<PostgresQueryResult> {
    return this.driver.query(statement);
  }

  command(statement: SqlStatement): Promise<PostgresQueryResult> {
    return this.driver.command(statement);
  }

  async commit(): Promise<void> {
    this.snapshot = undefined;
  }

  async rollback(): Promise<void> {
    if (this.tables && this.snapshot) this.tables.restore(this.snapshot);
  }

  async savepoint(name: string): Promise<void> {
    await this.driver.execute(`SAVEPOINT ${safe(name)}`, []);
  }

  async rollbackTo(name: string): Promise<void> {
    await this.driver.execute(`ROLLBACK TO SAVEPOINT ${safe(name)}`, []);
    if (this.tables && this.snapshot) this.tables.restore(this.snapshot);
  }
}

function safe(name: string): string {
  if (!/^[a-zA-Z0-9_]+$/.test(name)) throw new Error("Neveljaven savepoint.");
  return name;
}

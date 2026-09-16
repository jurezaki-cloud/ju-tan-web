import type { QuerySpec, SqlParam, SqlStatement } from "@/src/types/postgres";
import { ALLOWED_TABLES, assertSafeIdent } from "../migrations/utils";
import { QueryError } from "../errors";

const IDENT = /^[a-z_][a-z0-9_]*$/;

export class SqlQueryBuilder {
  select(table: string, filters: Record<string, SqlParam | undefined> = {}, options: { includeDeleted?: boolean; orderBy?: QuerySpec["orderBy"]; limit?: number; offset?: number; joins?: QuerySpec["joins"] } = {}): SqlStatement {
    return this.compile({
      table,
      op: "select",
      filters,
      includeDeleted: options.includeDeleted,
      orderBy: options.orderBy,
      limit: options.limit,
      offset: options.offset,
      joins: options.joins,
    });
  }

  insert(table: string, data: Record<string, unknown>): SqlStatement {
    return this.compile({ table, op: "insert", data });
  }

  update(table: string, filters: Record<string, SqlParam | undefined>, data: Record<string, unknown>, expectedVersion?: number): SqlStatement {
    return this.compile({ table, op: "update", filters, data, expectedVersion });
  }

  softDelete(table: string, filters: Record<string, SqlParam | undefined>, expectedVersion?: number): SqlStatement {
    return this.compile({ table, op: "soft-delete", filters, expectedVersion });
  }

  count(table: string, filters: Record<string, SqlParam | undefined> = {}): SqlStatement {
    return this.compile({ table, op: "count", filters });
  }

  exists(table: string, filters: Record<string, SqlParam | undefined>): SqlStatement {
    return this.compile({ table, op: "exists", filters, limit: 1 });
  }

  compile(spec: QuerySpec): SqlStatement {
    if (!ALLOWED_TABLES.has(spec.table)) throw new QueryError(`Tabela ni dovoljena: ${spec.table}`);
    const table = assertSafeIdent(spec.table);
    const params: SqlParam[] = [];
    const push = (value: unknown): string => {
      params.push(toParam(value));
      return `$${params.length}`;
    };

    if (spec.op === "insert") {
      const data = spec.data ?? {};
      const keys = Object.keys(data).filter((key) => IDENT.test(toColumn(key)));
      const columns = keys.map((key) => toColumn(key));
      const values = keys.map((key) => push(data[key]));
      return {
        text: `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${values.join(", ")})`,
        params,
        spec,
      };
    }

    const where: string[] = [];
    for (const [key, value] of Object.entries(spec.filters ?? {})) {
      if (value === undefined) continue;
      if (!IDENT.test(toColumn(key))) throw new QueryError("Neveljaven filter.");
      where.push(`${toColumn(key)} = ${push(value)}`);
    }
    if (!spec.includeDeleted) {
      where.push("deleted_at IS NULL");
    }
    const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";
    const joins = (spec.joins ?? [])
      .map((join) => {
        if (!ALLOWED_TABLES.has(join.table)) throw new QueryError("Join tabela ni dovoljena.");
        if (!/^[a-z0-9_.= ]+$/i.test(join.on)) throw new QueryError("Neveljaven JOIN pogoj.");
        return ` JOIN ${assertSafeIdent(join.table)} ON ${join.on}`;
      })
      .join("");

    if (spec.op === "count") {
      return { text: `SELECT COUNT(*)::int AS count FROM ${table}${joins}${whereSql}`, params, spec };
    }
    if (spec.op === "exists") {
      return { text: `SELECT 1 FROM ${table}${joins}${whereSql} LIMIT 1`, params, spec };
    }
    if (spec.op === "soft-delete") {
      const version = spec.expectedVersion !== undefined ? ` AND version = ${push(spec.expectedVersion)}` : "";
      return {
        text: `UPDATE ${table} SET deleted_at = ${push(new Date().toISOString())}, status = ${push("archived")}, version = version + 1, updated_at = ${push(new Date().toISOString())}${whereSql}${version}`,
        params,
        spec,
      };
    }
    if (spec.op === "update") {
      const data = spec.data ?? {};
      const assignments = Object.keys(data)
        .filter((key) => IDENT.test(toColumn(key)))
        .map((key) => `${toColumn(key)} = ${push(data[key])}`);
      const version = spec.expectedVersion !== undefined ? ` AND version = ${push(spec.expectedVersion)}` : "";
      assignments.push(`version = version + 1`);
      assignments.push(`updated_at = ${push(new Date().toISOString())}`);
      return { text: `UPDATE ${table} SET ${assignments.join(", ")}${whereSql}${version}`, params, spec };
    }

    const order = spec.orderBy ? ` ORDER BY ${assertSafeIdent(toColumn(spec.orderBy.column))} ${spec.orderBy.direction === "desc" ? "DESC" : "ASC"}` : "";
    const limit = spec.limit !== undefined ? ` LIMIT ${push(spec.limit)}` : "";
    const offset = spec.offset !== undefined ? ` OFFSET ${push(spec.offset)}` : "";
    return { text: `SELECT * FROM ${table}${joins}${whereSql}${order}${limit}${offset}`, params, spec };
  }
}

export function toColumn(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toParam(value: unknown): SqlParam {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  return JSON.stringify(value);
}
